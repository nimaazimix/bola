import { createZodDto } from "nestjs-zod";
import { ApiSuccessSchema } from "@bola/contracts/api";
import { CheckSlugQuerySchema, CheckSlugResultSchema } from "@bola/contracts/workspaces";

export class CheckSlugQueryDto extends createZodDto(CheckSlugQuerySchema) {}
export class CheckSlugResponseDto extends createZodDto(ApiSuccessSchema(CheckSlugResultSchema)) {}
