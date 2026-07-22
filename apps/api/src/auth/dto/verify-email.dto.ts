import { createZodDto } from "nestjs-zod";
import { VerifyEmailSchema } from "@bola/contracts/auth";

export class VerifyEmailDto extends createZodDto(VerifyEmailSchema) {}
