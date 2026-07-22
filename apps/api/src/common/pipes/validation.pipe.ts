import { BadRequestException, PipeTransform, Type } from "@nestjs/common";
import { createZodValidationPipe } from "nestjs-zod";
import { ZodError } from "zod";

export const ValidationPipe: Type<PipeTransform> = createZodValidationPipe({
  createValidationException: (error) =>
    new BadRequestException(formatValidationError(error as ZodError)),
});

export function formatValidationError(error: ZodError) {
  return {
    code: "common.validation_failed",
    message: "Invalid request payload",
    details: error.issues,
  };
}
