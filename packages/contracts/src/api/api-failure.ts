import z from "zod";
import { ApiMetaSchema } from "./api-meta";

export const ApiFailureSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
  meta: ApiMetaSchema.optional(),
});

export type ApiFailure = z.infer<typeof ApiFailureSchema>;
export type ApiError = ApiFailure["error"];
