import { BadRequestException, PipeTransform, Type } from "@nestjs/common";
import { createZodValidationPipe } from "nestjs-zod";
import { z, ZodError } from "zod";

export const ValidationPipe: Type<PipeTransform> = createZodValidationPipe({
  createValidationException: (error) =>
    new BadRequestException(formatValidationError(error as ZodError)),
});

export function formatValidationError(error: ZodError) {
  const details: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const field = issue.path.length ? issue.path.join(".") : "root";

    if (!details[field]) {
      details[field] = [];
    }
    details[field].push(issue.message);
  }

  return {
    code: "common.validation_failed",
    message: "Invalid request payload",
    details,
  };
}

z.config({
  customError: (issue) => {
    if (issue.code === "invalid_type") {
      if (issue.input === undefined) {
        return "Required";
      }
      return `Invalid type, expected ${issue.expected}`;
    }
  },
});
