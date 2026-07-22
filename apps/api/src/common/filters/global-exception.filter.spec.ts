import { ArgumentsHost, BadRequestException, Logger } from "@nestjs/common";
import { GlobalExceptionFilter } from "./global-exception.filter";

describe("GlobalExceptionFilter", () => {
  let filter: GlobalExceptionFilter;

  const json = jest.fn();
  const status = jest.fn(() => ({ json }));

  const host = {
    switchToHttp: () => ({
      getResponse: () => ({ status }),
    }),
  };

  beforeEach(() => {
    jest.spyOn(Logger.prototype, "error").mockImplementation();

    filter = new GlobalExceptionFilter();
  });

  it("should be defined", () => {
    expect(filter).toBeDefined();
  });

  it("should log exceptions", async () => {
    // Arrange
    const exception = new Error("Unexpected");

    // Act
    filter.catch(exception, host as ArgumentsHost);

    // Assert
    expect(Logger.prototype.error).toHaveBeenCalledWith(exception);
  });

  it("should fall back to internal server error for unknown exceptions", () => {
    // Arrange
    const exception = new Error("Unexpected");

    // Act
    filter.catch(exception, host as ArgumentsHost);

    // Assert
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: "common.internal_error",
        message: "Something went wrong",
      },
    });
  });

  it("should envelope the payload from http exceptions", () => {
    // Arrange
    const error = {
      code: "code",
      message: "message",
      details: { id: "usr_id" },
    };
    const exception = new BadRequestException(error);

    // Act
    filter.catch(exception, host as ArgumentsHost);

    // Assert
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ success: false, error });
  });

  it("should handle http exceptions with missing fields", () => {
    // Arrange
    const exception = new BadRequestException({});

    // Act
    filter.catch(exception, host as ArgumentsHost);

    // Assert
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: "common.unknown_error",
        message: "Bad Request",
      },
    });
  });

  it("should handle http exceptions with string payload", () => {
    // Arrange
    const exception = new BadRequestException("message");

    // Act
    filter.catch(exception, host as ArgumentsHost);

    // Assert
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: "common.unknown_error",
        message: "message",
      },
    });
  });

  it("should handle empty http exceptions", () => {
    // Arrange
    const exception = new BadRequestException();

    // Act
    filter.catch(exception, host as ArgumentsHost);

    // Assert
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: "common.unknown_error",
        message: "Bad Request",
      },
    });
  });
});
