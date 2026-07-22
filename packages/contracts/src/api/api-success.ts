import z from "zod";

export const ApiSuccessSchema = (DataSchema: z.ZodType) =>
  z.object({
    success: z.literal(true),
    data: DataSchema,
  });

export interface ApiSuccess<T> {
  success: true;
  data: T;
}
