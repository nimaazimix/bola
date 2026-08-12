import { createZodDto } from "nestjs-zod";
import { ApiSuccessSchema } from "@bola/contracts/api";
import { BoardSchema } from "@bola/contracts/boards";

export class BoardResponseDto extends createZodDto(ApiSuccessSchema(BoardSchema)) {}
export class BoardListResponseDto extends createZodDto(ApiSuccessSchema(BoardSchema.array())) {}
