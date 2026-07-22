import { createZodDto } from "nestjs-zod";
import { ApiSuccessSchema } from "@bola/contracts/api";
import { AuthPayloadSchema } from "@bola/contracts/auth";

export class AuthResponseDto extends createZodDto(ApiSuccessSchema(AuthPayloadSchema)) {}
