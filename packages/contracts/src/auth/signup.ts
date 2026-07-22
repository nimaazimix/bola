import z from "zod";

export const SignupSchema = z.object({
  name: z.string().nonempty(),
  email: z.email(),
  password: z.string().nonempty().min(8),
});

export const SignupQuerySchema = z.object({
  redirect: z.string().nonempty().optional(),
});

export type SignupInput = z.infer<typeof SignupSchema>;
export type SignupQuery = z.infer<typeof SignupQuerySchema>;
