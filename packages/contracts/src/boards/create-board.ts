import z from "zod";

export const CreateBoardSchema = z.object({
  name: z.string().nonempty("Please enter a name"),
});

export type CreateBoardInput = z.infer<typeof CreateBoardSchema>;
