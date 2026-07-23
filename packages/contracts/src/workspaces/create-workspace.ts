import z from "zod";

export const CreateWorkspaceSchema = z.object({
  name: z.string().nonempty("Please enter a name"),
  slug: z
    .string()
    .nonempty("Please enter a slug")
    .min(3, "Slug must be at least 3 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain lowercase letters, numbers, and non-consecutive hyphens",
    ),
});

export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceSchema>;
