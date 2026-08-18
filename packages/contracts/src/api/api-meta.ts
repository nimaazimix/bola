import z from "zod";

export const ApiMetaSchema = z.object({
  pagination: z
    .object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
    })
    .optional(),
});

export type ApiMeta = z.infer<typeof ApiMetaSchema>;
export type PaginationMeta = ApiMeta["pagination"];
