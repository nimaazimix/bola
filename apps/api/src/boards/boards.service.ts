import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService, User } from "src/prisma/prisma.service";
import { WorkspacesService } from "src/workspaces/workspaces.service";
import { AbilityFactory } from "src/casl/ability.factory";
import { Action } from "src/common/constants";
import { ApiResult } from "src/common/interceptors";
import { BoardListQueryDto, CreateBoardDto } from "./dto";
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

  async findAll(workspaceSlug: string, query: BoardListQueryDto, user: User) {
    const workspace = await this.workspacesService.findOneAccessible(workspaceSlug, user);

    const boards = await this.prismaService.board.findMany({
      where: {
        workspaceId: workspace.id,
        ...(query.q && {
          name: {
            contains: query.q,
            mode: "insensitive",
          },
        }),
      },

      orderBy: { createdAt: "desc" },
      cursor: query.cursor ? { id: query.cursor } : undefined, // Start from the cursor
      skip: query.cursor ? 1 : undefined, // Skip the cursor itself
      take: query.limit + 1, // Fetch extra to check the next page
    });

    const hasNextPage = boards.length > query.limit;

    // Drop the extra item if there is a next page
    const results = hasNextPage ? boards.slice(0, query.limit) : boards;
    const nextCursor = hasNextPage ? results.at(-1)!.id : null;

    return new ApiResult(results, {
      pagination: {
        type: "cursor",
        limit: query.limit,
        nextCursor,
      },
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
