import z from "zod";

export const AuthSearchSchema = z.object({
  redirect: z.string().nonempty().optional().catch(undefined),
});

export const VerifyEmailSearchSchema = AuthSearchSchema.extend({
  token: z.string().nonempty().optional().catch(undefined),
});
