import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getAxiosErrorData } from "./errors";

describe("getAxiosErrorData", () => {
  it("should return response data", () => {
    // Arrange
    const apiError = {
      success: false,
      error: {
        code: "common.internal_error",
        message: "Something went wrong",
      },
    };

    const error = new AxiosError();
    error.response = {
      status: 500,
      statusText: "Internal Server Error",
      data: apiError,
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    };

    // Act, Assert
    expect(getAxiosErrorData(error)).toEqual(apiError);
  });

  it("should return undefined when there is no response", () => {
    // Arrange
    const error = new AxiosError();

    // Act, Assert
    expect(getAxiosErrorData(error)).toBeUndefined();
  });

  it("should return undefined when the error is not from axios", () => {
    // Arrange
    const error = new Error();

    // Act, Assert
    expect(getAxiosErrorData(error)).toBeUndefined();
  });
});
