import { createZodDto } from "nestjs-zod";
import { SignUpQuerySchema, SignUpSchema } from "@bola/contracts/auth";

export class SignUpDto extends createZodDto(SignUpSchema) {}
export class SignUpQueryDto extends createZodDto(SignUpQuerySchema) {}
