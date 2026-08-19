import z from "zod";
import { PaginationMetaSchema } from "./pagination-meta";

export const ApiMetaSchema = z.object({
  pagination: PaginationMetaSchema.optional(),
});

export type ApiMeta = z.infer<typeof ApiMetaSchema>;
