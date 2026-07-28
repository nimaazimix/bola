import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { getAxiosErrorData } from "./errors";

vi.mock("sonner");

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

  it("should toast a general message when there is no response", () => {
    // Arrange
    const error = new AxiosError();

    // Act, Assert
    expect(getAxiosErrorData(error)).toBeUndefined();
    expect(toast.error).toHaveBeenCalledWith("Something went wrong");
  });

  it("should toast a general message when the error is not from axios", () => {
    // Arrange
    const error = new Error();

    // Act, Assert
    expect(getAxiosErrorData(error)).toBeUndefined();
    expect(toast.error).toHaveBeenCalledWith("Something went wrong");
  });

  it("should disable toasting when it is called with toast: false option", () => {
    // Arrange
    const error = new Error();

    // Act, Assert
    expect(getAxiosErrorData(error, { toast: false })).toBeUndefined();
    expect(toast.error).not.toHaveBeenCalled();
  });
});
