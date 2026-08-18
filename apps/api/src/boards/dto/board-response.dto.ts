import { createZodDto } from "nestjs-zod";
import { ApiSuccessSchema } from "@bola/contracts/api";
import { BoardListQuerySchema, BoardSchema } from "@bola/contracts/boards";

export class BoardResponseDto extends createZodDto(ApiSuccessSchema(BoardSchema)) {}
export class BoardListResponseDto extends createZodDto(ApiSuccessSchema(BoardSchema.array())) {}

export class BoardListQueryDto extends createZodDto(BoardListQuerySchema) {}
