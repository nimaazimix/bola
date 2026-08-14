import z from "zod";

export const BoardSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date().transform((arg) => arg.toISOString()),
  updatedAt: z.date().transform((arg) => arg.toISOString()),
});

export type Board = z.infer<typeof BoardSchema>;
