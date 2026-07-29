import z from "zod";
import { EmailSchema } from "../common";

export const SignUpSchema = z.object({
  name: z.string().nonempty("Please enter your name"),
  email: EmailSchema({ empty: "Please enter your email address" }),
  password: z
    .string()
    .nonempty("Please enter your password")
    .min(8, "Password must be at least 8 characters"),
});

export const SignUpQuerySchema = z.object({
  redirect: z.string().nonempty().optional(),
});

export type SignUpInput = z.infer<typeof SignUpSchema>;
export type SignUpQuery = z.infer<typeof SignUpQuerySchema>;
