import z from "zod";

export const BoardListQuerySchema = z.object({
  q: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().positive().default(20),
});

export type BoardListQueryIn = z.input<typeof BoardListQuerySchema>;
export type BoardListQuery = z.infer<typeof BoardListQuerySchema>;
