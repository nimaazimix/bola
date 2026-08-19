import z from "zod";

export const PaginationMetaSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("offset"),
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().nonnegative(),
  }),
  z.object({
    type: z.literal("cursor"),
    limit: z.number().int().positive(),
    nextCursor: z.string().nullable(),
  }),
]);

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;
