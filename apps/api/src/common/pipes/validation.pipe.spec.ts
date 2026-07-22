import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { ValidationPipe } from "./validation.pipe";

const schema = z
  .object({
    fieldA: z.string().min(1, "issue1"),
    fieldB: z.array(z.object({ inner: z.number().min(2, "issue2") })),
  })
  .loose()
  .refine((arg) => Object.keys(arg).length === 2, "issue3");

describe("ValidationPipe", () => {
  let pipe: PipeTransform;

  const metadata: ArgumentMetadata = {
    type: "body",
    metatype: class extends createZodDto(schema) {},
  };

  beforeEach(() => {
    pipe = new ValidationPipe();
  });

  it("should be defined", () => {
    expect(pipe).toBeDefined();
  });

  it("should pass valid data", () => {
    // Arrange
    const data = {
      fieldA: "John Doe",
      fieldB: [{ inner: 2 }, { inner: 4 }],
    };

    // Act, Assert
    expect(pipe.transform(data, metadata)).toEqual(data);
  });

  it("should throw BadRequestException for invalid data", () => {
    // Arrange
    const data = {
      fieldA: "",
      fieldB: [{ inner: 2 }, { inner: 1 }],
      extra: null,
    };

    try {
      // Act
      pipe.transform(data, metadata);
      throw new Error("Expected to throw");
    } catch (error) {
      // Assert
      expect(error).toBeInstanceOf(BadRequestException);
      expect((error as BadRequestException).getResponse()).toEqual({
        code: "common.validation_failed",
        message: "Invalid request payload",
        details: expect.any(Array),
      });
    }
  });
});
