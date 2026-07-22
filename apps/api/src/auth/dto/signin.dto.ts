import { createZodDto } from "nestjs-zod";
import { SigninSchema } from "@bola/contracts/auth";

export class SigninDto extends createZodDto(SigninSchema) {}
