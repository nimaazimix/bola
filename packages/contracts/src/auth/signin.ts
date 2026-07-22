import z from "zod";

export const SigninSchema = z.object({
  email: z.email(),
  password: z.string().nonempty(),
});

export type SigninInput = z.infer<typeof SigninSchema>;
