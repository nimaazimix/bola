import z from "zod";
import { UserSchema } from "../users";

export const AuthPayloadSchema = z.object({
  accessToken: z.string(),
  user: UserSchema,
});

export type AuthPayload = z.infer<typeof AuthPayloadSchema>;
