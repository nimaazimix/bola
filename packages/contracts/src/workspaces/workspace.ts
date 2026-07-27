import z from "zod";

export const WorkspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  image: z.string().nullable(),
  createdAt: z.date().transform((arg) => arg.toISOString()),
  updatedAt: z.date().transform((arg) => arg.toISOString()),
});

export type Workspace = z.infer<typeof WorkspaceSchema>;
