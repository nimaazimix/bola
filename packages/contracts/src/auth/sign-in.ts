import z from "zod";

export const SignInSchema = z.object({
  email: z.email({
    error: (issue) => {
      if (issue.code === "invalid_type") return;
      return issue.input!.length
        ? "Please enter a valid email address"
        : "Please enter your email address";
    },
  }),
  password: z.string().nonempty("Please enter your password"),
});

export type SignInInput = z.infer<typeof SignInSchema>;
