import { createZodDto } from "nestjs-zod";
import { CreateBoardSchema } from "@bola/contracts/boards";

export class CreateBoardDto extends createZodDto(CreateBoardSchema) {}
