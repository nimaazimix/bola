import { Test, TestingModule } from "@nestjs/testing";
import { mock, MockProxy } from "jest-mock-extended";
import { createPrismaServiceMock, PrismaServiceMock } from "test/mocks";
import {
  boardFactory,
  userFactory,
  workspaceFactory,
  WorkspaceMembershipFactory,
} from "test/factories";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { PrismaService, WorkspaceRole } from "src/prisma/prisma.service";
import { WorkspacesService } from "src/workspaces/workspaces.service";
import { AbilityFactory } from "src/casl/ability.factory";
import { ApiResult } from "src/common/interceptors";
import { BoardsService } from "./boards.service";

describe("BoardsService", () => {
  let service: BoardsService;

  let prismaServiceMock: PrismaServiceMock;
  let workspacesServiceMock: MockProxy<WorkspacesService>;

  const abilityFactoryMock = {
    createFor: jest.fn(),
  };

  beforeEach(async () => {
    prismaServiceMock = createPrismaServiceMock();
    workspacesServiceMock = mock<WorkspacesService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardsService,
        { provide: PrismaService, useValue: prismaServiceMock },
        { provide: WorkspacesService, useValue: workspacesServiceMock },
        { provide: AbilityFactory, useValue: abilityFactoryMock },
      ],
    }).compile();

    service = module.get<BoardsService>(BoardsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a board and return it successfully when user has the permission", async () => {
      // Arrange
      const dto = { name: "Planning" };
      const user = userFactory.build();
      const workspace = {
        ...workspaceFactory.build({ id: "wsp_id" }),
        membership: WorkspaceMembershipFactory.build({ workspaceId: "wsp_id", userId: user.id }),
      };
      const ability = { cannot: jest.fn(() => false) };
      const board = boardFactory.build({ ...dto, workspaceId: workspace.id });

      workspacesServiceMock.findOneAccessible.mockResolvedValue(workspace);
      abilityFactoryMock.createFor.mockReturnValue(ability);
      prismaServiceMock.board.create.mockResolvedValue(board);

      // Act
      const result = await service.create(dto, workspace.slug, user);

      // Assert
      expect(result).toEqual(board);
      expect(prismaServiceMock.board.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          workspace: { connect: { id: workspace.id } },
        },
      });
    });

    it("should throw ForbiddenException when user doesn't have the permission", async () => {
      // Arrange
      const dto = { name: "Planning" };
      const user = userFactory.build();
      const workspace = {
        ...workspaceFactory.build({ id: "wsp_id" }),
        membership: WorkspaceMembershipFactory.build({
          workspaceId: "wsp_id",
          userId: user.id,
          role: WorkspaceRole.MEMBER,
        }),
      };
      const ability = { cannot: jest.fn(() => true) };

      workspacesServiceMock.findOneAccessible.mockResolvedValue(workspace);
      abilityFactoryMock.createFor.mockReturnValue(ability);

      // Act, Assert
      await expect(service.create(dto, workspace.slug, user)).rejects.toThrow(ForbiddenException);
      expect(prismaServiceMock.board.create).not.toHaveBeenCalled();
    });

    it("should throw exceptions from findOneAccessible", async () => {
      // Arrange
      const dto = { name: "Planning" };
      const user = userFactory.build();
      const error = new NotFoundException();
      workspacesServiceMock.findOneAccessible.mockRejectedValue(error);

      // Act, Assert
      await expect(service.create(dto, "acme", user)).rejects.toThrow(error);
    });
  });

  describe("findAll", () => {
    it("should return paginated boards scoped to the workspace", async () => {
      // Arrange
      const query = { page: 1, limit: 4 };
      const user = userFactory.build();
      const workspace = {
        ...workspaceFactory.build({ id: "wsp_id" }),
        membership: WorkspaceMembershipFactory.build({ workspaceId: "wsp_id", userId: user.id }),
      };
      const boards = boardFactory.buildList(3, { workspaceId: workspace.id });

      workspacesServiceMock.findOneAccessible.mockResolvedValue(workspace);
      prismaServiceMock.board.findMany.mockResolvedValue(boards);
      prismaServiceMock.board.count.mockResolvedValue(3);

      // Act
      const result = await service.findAll(workspace.slug, query, user);

      // Arrange
      expect(result).toBeInstanceOf(ApiResult);
      expect(result).toEqual({
        data: boards,
        meta: {
          pagination: { page: 1, limit: 4, total: 3 },
        },
      });
      expect(prismaServiceMock.board.findMany).toHaveBeenCalledWith({
        where: { workspaceId: workspace.id },

        orderBy: { createdAt: "desc" },
        skip: 0,
        take: 4,
      });
    });

    it("should throw exceptions from findOneAccessible", async () => {
      // Arrange
      const query = { page: 1, limit: 4 };
      const user = userFactory.build();
      const error = new NotFoundException();
      workspacesServiceMock.findOneAccessible.mockRejectedValue(error);

      // Act, Assert
      await expect(service.findAll("acme", query, user)).rejects.toThrow(error);
    });
  });

  describe("findOne", () => {
    it("should find and return board by its id and workspace id", async () => {
      // Arrange
      const user = userFactory.build();
      const workspace = {
        ...workspaceFactory.build({ id: "wsp_id" }),
        membership: WorkspaceMembershipFactory.build({ workspaceId: "wsp_id", userId: user.id }),
      };
      const board = boardFactory.build({ workspaceId: workspace.id });

      workspacesServiceMock.findOneAccessible.mockResolvedValue(workspace);
      prismaServiceMock.board.findUnique.mockResolvedValue(board);

      // Act
      const result = await service.findOne(board.id, workspace.slug, user);

      // Arrange
      expect(result).toEqual(board);
      expect(prismaServiceMock.board.findUnique).toHaveBeenCalledWith({
        where: { id: board.id, workspaceId: workspace.id },
      });
    });

    it("should throw NotFoundException when board is not found", async () => {
      // Arrange
      const user = userFactory.build();
      const workspace = {
        ...workspaceFactory.build({ id: "wsp_id" }),
        membership: WorkspaceMembershipFactory.build({ workspaceId: "wsp_id", userId: user.id }),
      };

      workspacesServiceMock.findOneAccessible.mockResolvedValue(workspace);
      prismaServiceMock.board.findUnique.mockResolvedValue(null);

      // Act, Assert
      await expect(service.findOne("brd_id", workspace.slug, user)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should throw exceptions from findOneAccessible", async () => {
      // Arrange
      const user = userFactory.build();
      const error = new NotFoundException();
      workspacesServiceMock.findOneAccessible.mockRejectedValue(error);

      // Act, Assert
      await expect(service.findOne("brd_id", "acme", user)).rejects.toThrow(error);
    });
  });
});
