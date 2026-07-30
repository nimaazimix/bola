import z from "zod";
import { SlugSchema } from "../common";

export const CheckSlugQuerySchema = z.object({
  slug: SlugSchema(),
});

export const CheckSlugResultSchema = z.object({
  available: z.boolean(),
});

export type CheckSlugQuery = z.infer<typeof CheckSlugQuerySchema>;
export type CheckSlugResult = z.infer<typeof CheckSlugResultSchema>;
