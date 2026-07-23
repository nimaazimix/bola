import { createZodDto } from "nestjs-zod";
import { CreateWorkspaceSchema } from "@bola/contracts/workspaces";

export class CreateWorkspaceDto extends createZodDto(CreateWorkspaceSchema) {}
