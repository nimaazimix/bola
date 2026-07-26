import { createZodDto } from "nestjs-zod";
import { SignInSchema } from "@bola/contracts/auth";

export class SignInDto extends createZodDto(SignInSchema) {}
