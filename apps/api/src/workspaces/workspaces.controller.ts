import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { WorkspacesService } from "./workspaces.service";
import { ZodSerializerDto } from "nestjs-zod";
import { CurrentUser } from "src/common/decorators";
import {
  CheckSlugQueryDto,
  CheckSlugResponseDto,
  CreateWorkspaceDto,
  WorkspaceListResponseDto,
  WorkspaceResponseDto,
} from "./dto";
import type { User } from "@bola/db";

@Controller("workspaces")
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @Post()
  @ZodSerializerDto(WorkspaceResponseDto)
  async create(@Body() dto: CreateWorkspaceDto, @CurrentUser() user: User) {
    return this.workspacesService.create(dto, user);
  }

  @Get()
  @ZodSerializerDto(WorkspaceListResponseDto)
  async findAll(@CurrentUser() user: User) {
    return this.workspacesService.findAll(user);
  }

  @Get("check-slug")
  @ZodSerializerDto(CheckSlugResponseDto)
  async checkSlug(@Query() query: CheckSlugQueryDto) {
    return this.workspacesService.checkSlugAvailability(query.slug);
  }
}
