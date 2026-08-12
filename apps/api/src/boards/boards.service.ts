import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService, User } from "src/prisma/prisma.service";
import { WorkspacesService } from "src/workspaces/workspaces.service";
import { AbilityFactory } from "src/casl/ability.factory";
import { Action } from "src/common/constants";
import { CreateBoardDto } from "./dto";
import { BoardErrors } from "./errors";

@Injectable()
export class BoardsService {
  constructor(
    private prismaService: PrismaService,
    private workspacesService: WorkspacesService,
    private abilityFactory: AbilityFactory,
  ) {}

  async create(dto: CreateBoardDto, workspaceSlug: string, user: User) {
    const workspace = await this.workspacesService.findOneAccessible(workspaceSlug, user);

    const ability = this.abilityFactory.createFor(user, workspace);
    if (ability.cannot(Action.Create, "Board")) {
      throw new ForbiddenException(BoardErrors.CREATE_FORBIDDEN);
    }

    return this.prismaService.board.create({
      data: {
        ...dto,
        workspace: { connect: { id: workspace.id } },
      },
    });
  }

  async findAll(workspaceSlug: string, user: User) {
    const workspace = await this.workspacesService.findOneAccessible(workspaceSlug, user);

    return this.prismaService.board.findMany({
      where: { workspaceId: workspace.id },
    });
  }

  async findOne(boardId: string, workspaceSlug: string, user: User) {
    const workspace = await this.workspacesService.findOneAccessible(workspaceSlug, user);

    const board = await this.prismaService.board.findUnique({
      where: { id: boardId, workspaceId: workspace.id },
    });

    if (!board) {
      throw new NotFoundException(BoardErrors.NOT_FOUND);
    }

    return board;
  }
}
