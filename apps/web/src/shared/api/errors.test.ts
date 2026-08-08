import { AxiosError, type AxiosResponse } from "axios";
import { ApiError, toApiError } from "./errors";

describe("toApiError", () => {
  it("should return http error for axios errors that has response", () => {
    // Arrange
    const originalError = new AxiosError();
    originalError.response = {
      status: 500,
      data: {
        success: false,
        error: {
          message: "Internal server error",
          code: "common.internal_error",
          details: { reason: "server" },
        },
      },
    } as AxiosResponse;

    // Act
    const result = toApiError(originalError);

    // Assert
    expect(result).toBeInstanceOf(ApiError);
    expect(result.kind).toBe("http");
    expect(result.status).toBe(500);
    expect(result.message).toBe("Internal server error");
    expect(result.code).toBe("common.internal_error");
    expect(result.details).toEqual({ reason: "server" });
    expect(result.cause).toBe(originalError);
  });

  it("should return network error for axios errors that has request and no response", () => {
    // Arrange
    const originalError = new AxiosError();
    originalError.request = {};

    // Act
    const result = toApiError(originalError);

    // Assert
    expect(result).toBeInstanceOf(ApiError);
    expect(result.kind).toBe("network");
    expect(result.message).toBe("Unable to connect to the server");
    expect(result.cause).toBe(originalError);
  });

  it("should return unknown error for unexpected axios errors", () => {
    // Arrange
    const originalError = new AxiosError();

    // Act
    const result = toApiError(originalError);

    // Assert
    expect(result).toBeInstanceOf(ApiError);
    expect(result.kind).toBe("unknown");
    expect(result.message).toBe("Something went wrong");
    expect(result.cause).toBe(originalError);
  });

  it("should return unknown error for non-axios errors", () => {
    // Arrange
    const originalError = new Error();

    // Act
    const result = toApiError(originalError);

    // Assert
    expect(result).toBeInstanceOf(ApiError);
    expect(result.kind).toBe("unknown");
    expect(result.message).toBe("Something went wrong");
    expect(result.cause).toBe(originalError);
  });
});
