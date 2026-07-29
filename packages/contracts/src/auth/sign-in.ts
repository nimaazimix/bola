import z from "zod";
import { EmailSchema } from "../common";

export const SignInSchema = z.object({
  email: EmailSchema({ empty: "Please enter your email address" }),
  password: z.string().nonempty("Please enter your password"),
});

export type SignInInput = z.infer<typeof SignInSchema>;
