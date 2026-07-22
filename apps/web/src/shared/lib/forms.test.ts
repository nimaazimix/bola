import { toast } from "sonner";
import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { handleSubmitError } from "./forms";

vi.mock("sonner");

describe("handleSubmitError", () => {
  it("should toast API error message when it responds with unrelated code", () => {
    // Arrange
    const error = new AxiosError();
    error.response = {
      status: 400,
      statusText: "Bad Request",
      data: {
        success: false,
        error: { code: "common.something_else", message: "Server exploded" },
      },
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    };

    // Act, Assert
    expect(handleSubmitError(error)).toBeUndefined();
    expect(toast.error).toHaveBeenCalledWith("Server exploded");
  });

  it("should toast generic message when there is no API response", () => {
    // Arrange
    const error = new AxiosError();

    // Act, Assert
    expect(handleSubmitError(error)).toBeUndefined();
    expect(toast.error).toHaveBeenCalledWith("Something went wrong");
  });

  it("should toast generic message for non-axios errors", () => {
    // Arrange
    const error = new Error();

    // Act, Assert
    expect(handleSubmitError(error)).toBeUndefined();
    expect(toast.error).toHaveBeenCalledWith("Something went wrong");
  });
});
