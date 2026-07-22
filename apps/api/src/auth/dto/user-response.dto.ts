import { createZodDto } from "nestjs-zod";
import { ApiSuccessSchema } from "@bola/contracts/api";
import { UserSchema } from "@bola/contracts/user";

export class UserResponseDto extends createZodDto(ApiSuccessSchema(UserSchema)) {}
