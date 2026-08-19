import z from "zod";
import { ApiMeta, ApiMetaSchema } from "./api-meta";

export const ApiSuccessSchema = (DataSchema: z.ZodType) =>
  z.object({
    success: z.literal(true),
    data: DataSchema,
    meta: ApiMetaSchema.optional(),
  });

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: ApiMeta;
}
