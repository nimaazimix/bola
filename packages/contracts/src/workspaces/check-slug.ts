import z from "zod";
import { CreateWorkspaceSchema } from "./create-workspace";

export const CheckSlugQuerySchema = CreateWorkspaceSchema.pick({ slug: true });

export const CheckSlugResultSchema = z.object({
  available: z.boolean(),
});

export type CheckSlugQuery = z.infer<typeof CheckSlugQuerySchema>;
export type CheckSlugResult = z.infer<typeof CheckSlugResultSchema>;
