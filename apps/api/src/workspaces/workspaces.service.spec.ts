import { Test, TestingModule } from "@nestjs/testing";
import { createPrismaServiceMock, PrismaServiceMock } from "test/mocks";
import { userFactory, workspaceFactory, WorkspaceMembershipFactory } from "test/factories";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { Prisma, PrismaService, WorkspaceRole } from "src/prisma/prisma.service";
import { WorkspacesService } from "./workspaces.service";

describe("WorkspacesService", () => {
  let service: WorkspacesService;

  let prismaServiceMock: PrismaServiceMock;

  beforeEach(async () => {
    prismaServiceMock = createPrismaServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkspacesService, { provide: PrismaService, useValue: prismaServiceMock }],
    }).compile();

    service = module.get<WorkspacesService>(WorkspacesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create workspace for the current user and return it successfully", async () => {
      // Arrange
      const dto = { name: "Acme", slug: "acme" };
      const user = userFactory.build({ emailVerified: true });
      const workspace = {
        ...workspaceFactory.build({ id: "wsp_id", ...dto }),
        memberships: WorkspaceMembershipFactory.buildList(1, {
          workspaceId: "wsp_id",
          userId: user.id,
        }),
      };

      prismaServiceMock.workspace.create.mockResolvedValue(workspace);

      // Act
      const result = await service.create(dto, user);

      // Assert
      const { memberships, ...fields } = workspace;
      expect(result).toEqual({
        ...fields,
        membership: memberships[0],
      });

      expect(prismaServiceMock.workspace.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          memberships: {
            create: {
              role: WorkspaceRole.OWNER,
              user: { connect: { id: user.id } },
            },
          },
        },
        include: {
          memberships: {
            where: { userId: user.id },
          },
        },
      });
    });

    it("should throw ConflictException when provided slug is not unique", async () => {
      // Arrange
      const dto = { name: "Acme", slug: "acme" };
      const user = userFactory.build({ emailVerified: true });
      const error = new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "",
        meta: {
          modelName: "Workspace",
        },
      });

      prismaServiceMock.workspace.create.mockRejectedValue(error);

      // Act, Assert
      await expect(service.create(dto, user)).rejects.toBeInstanceOf(ConflictException);
    });

    it("should rethrow unknown errors", async () => {
      // Arrange
      const dto = { name: "Acme", slug: "acme" };
      const user = userFactory.build({ emailVerified: true });
      const error = new Error("Unexpected");

      prismaServiceMock.workspace.create.mockRejectedValue(error);

      // Act, Assert
      await expect(service.create(dto, user)).rejects.toThrow(error);
    });
  });

  describe("findAllAccessible", () => {
    it("should return user's accessible workspaces ordered by their name", async () => {
      // Arrange
      const user = userFactory.build({ emailVerified: true });
      const workspaces = workspaceFactory.buildList(3).map((workspace) => ({
        ...workspace,
        memberships: WorkspaceMembershipFactory.buildList(1, {
          workspaceId: workspace.id,
          userId: user.id,
        }),
      }));

      prismaServiceMock.workspace.findMany.mockResolvedValue(workspaces);

      // Act
      const result = await service.findAllAccessible(user);

      // Assert
      expect(result).toEqual(
        workspaces.map(({ memberships, ...fields }) => ({
          ...fields,
          membership: memberships[0],
        })),
      );
      expect(prismaServiceMock.workspace.findMany).toHaveBeenCalledWith({
        where: {
          memberships: { some: { userId: user.id } },
        },
        include: {
          memberships: {
            where: { userId: user.id },
          },
        },
        orderBy: { name: "asc" },
      });
    });
  });

  describe("findOneAccessible", () => {
    it("should find and return accessible workspace by its slug", async () => {
      // Arrange
      const slug = "acme";
      const user = userFactory.build();
      const workspace = {
        ...workspaceFactory.build({ id: "wsp_id", slug }),
        memberships: WorkspaceMembershipFactory.buildList(1, {
          workspaceId: "wsp_id",
          userId: user.id,
        }),
      };
      prismaServiceMock.workspace.findUnique.mockResolvedValue(workspace);

      // Act
      const result = await service.findOneAccessible(slug, user);

      // Arrange
      const { memberships, ...fields } = workspace;
      expect(result).toEqual({
        ...fields,
        membership: memberships[0],
      });

      expect(prismaServiceMock.workspace.findUnique).toHaveBeenCalledWith({
        where: {
          slug,
          memberships: { some: { userId: user.id } },
        },
        include: {
          memberships: {
            where: { userId: user.id },
          },
        },
      });
    });

    it("should throw NotFoundException when workspace is not found", async () => {
      // Arrange
      const slug = "acme";
      const user = userFactory.build();
      prismaServiceMock.workspace.findUnique.mockResolvedValue(null);

      // Act, Assert
      await expect(service.findOneAccessible(slug, user)).rejects.toThrow(NotFoundException);
    });
  });

  describe("checkSlugAvailability", () => {
    it("should return available when slug is not in use yet", async () => {
      // Arrange
      prismaServiceMock.workspace.findUnique.mockResolvedValue(null);

      // Act, Assert
      expect(service.checkSlugAvailability("acme")).resolves.toEqual({ available: true });
    });

    it("should return unavailable when slug is already in use", async () => {
      // Arrange
      const workspace = workspaceFactory.build();
      prismaServiceMock.workspace.findUnique.mockResolvedValue(workspace);

      // Act, Assert
      expect(service.checkSlugAvailability("acme")).resolves.toEqual({ available: false });
    });
  });
});
