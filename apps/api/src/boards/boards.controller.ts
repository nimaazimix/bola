import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { BoardsService } from "./boards.service";
import { ZodSerializerDto } from "nestjs-zod";
import { CurrentUser } from "src/common/decorators";
import { BoardListQueryDto, BoardListResponseDto, BoardResponseDto, CreateBoardDto } from "./dto";
import type { User } from "@bola/db";

@Controller("/workspaces/:workspaceSlug/boards")
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Post()
  @ZodSerializerDto(BoardResponseDto)
  async create(
    @Body() dto: CreateBoardDto,
    @Param("workspaceSlug") workspaceSlug: string,
    @CurrentUser() user: User,
  ) {
    return this.boardsService.create(dto, workspaceSlug, user);
  }

  @Get()
  @ZodSerializerDto(BoardListResponseDto)
  async findAll(
    @Param("workspaceSlug") workspaceSlug: string,
    @Query() query: BoardListQueryDto,
    @CurrentUser() user: User,
  ) {
    return this.boardsService.findAll(workspaceSlug, query, user);
  }

  @Get(":boardId")
  @ZodSerializerDto(BoardResponseDto)
  async findOne(
    @Param("boardId") boardId: string,
    @Param("workspaceSlug") workspaceSlug: string,
    @CurrentUser() user: User,
  ) {
    return this.boardsService.findOne(boardId, workspaceSlug, user);
  }
}
