import { createZodDto } from "nestjs-zod";
import { ApiSuccessSchema } from "@bola/contracts/api";
import { UserSchema } from "@bola/contracts/users";

export class UserResponseDto extends createZodDto(ApiSuccessSchema(UserSchema)) {}
