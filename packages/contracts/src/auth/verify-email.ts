import z from "zod";

export const VerifyEmailSchema = z.object({
  token: z.string().nonempty(),
});

export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;
