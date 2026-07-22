import { createZodDto } from "nestjs-zod";
import { SignupQuerySchema, SignupSchema } from "@bola/contracts/auth";

export class SignupDto extends createZodDto(SignupSchema) {}
export class SignupQueryDto extends createZodDto(SignupQuerySchema) {}
