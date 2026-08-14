import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { BoardsService } from "./boards.service";
import { ZodSerializerDto } from "nestjs-zod";
import { CurrentUser } from "src/common/decorators";
import { BoardListResponseDto, BoardResponseDto, CreateBoardDto } from "./dto";
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
  async findAll(@Param("workspaceSlug") workspaceSlug: string, @CurrentUser() user: User) {
    return this.boardsService.findAll(workspaceSlug, user);
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
