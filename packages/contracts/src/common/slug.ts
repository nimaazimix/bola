import z from "zod";

interface SlugErrors {
  empty?: string;
  too_short?: string;
  invalid_format?: string;
}

export const SlugSchema = ({
  empty = "Please enter a slug",
  too_short = "Slug must be at least 3 characters",
  invalid_format = "Slug must contain lowercase letters, numbers, and non-consecutive hyphens",
}: SlugErrors = {}) =>
  z
    .string()
    .nonempty(empty)
    .min(3, too_short)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, invalid_format);
