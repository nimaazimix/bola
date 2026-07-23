import z from "zod";

export const SignupSchema = z.object({
  name: z.string().nonempty("Please enter your name"),
  email: z.email({
    error: (issue) => {
      if (issue.code === "invalid_type") return;
      return issue.input!.length
        ? "Please enter a valid email address"
        : "Please enter your email address";
    },
  }),
  password: z
    .string()
    .nonempty("Please enter your password")
    .min(8, "Password must be at least 8 characters"),
});

export const SignupQuerySchema = z.object({
  redirect: z.string().nonempty().optional(),
});

export type SignupInput = z.infer<typeof SignupSchema>;
export type SignupQuery = z.infer<typeof SignupQuerySchema>;
