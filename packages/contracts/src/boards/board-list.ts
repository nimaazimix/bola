import z from "zod";

export const BoardListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(20),
});

export type BoardListQuery = z.infer<typeof BoardListQuerySchema>;
