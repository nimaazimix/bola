import z from "zod";
import { SlugSchema } from "../common";

export const CreateWorkspaceSchema = z.object({
  name: z.string().nonempty("Please enter a name"),
  slug: SlugSchema(),
});

export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceSchema>;
