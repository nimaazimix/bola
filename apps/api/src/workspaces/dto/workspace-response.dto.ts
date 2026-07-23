import { createZodDto } from "nestjs-zod";
import { ApiSuccessSchema } from "@bola/contracts/api";
import { WorkspaceSchema } from "@bola/contracts/workspaces";

export class WorkspaceResponseDto extends createZodDto(ApiSuccessSchema(WorkspaceSchema)) {}
