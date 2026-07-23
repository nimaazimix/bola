import { toast } from "sonner";
import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { handleSubmitError } from "./forms";

vi.mock("sonner");

describe("handleSubmitError", () => {
  it("should toast API error message successfully", () => {
    // Arrange
    const error = new AxiosError();
    error.response = {
      status: 400,
      statusText: "Bad Request",
      data: {
        success: false,
        error: { code: "common.something", message: "This message is from API" },
      },
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    };

    // Act
    handleSubmitError(error);

    // Assert
    expect(toast.error).toHaveBeenCalledWith("This message is from API");
  });

  it("should toast generic message when there is no API response", () => {
    // Arrange
    const error = new AxiosError();

    // Act
    handleSubmitError(error);

    // Assert
    expect(toast.error).toHaveBeenCalledWith("Something went wrong");
  });

  it("should toast generic message for non-axios errors", () => {
    // Arrange
    const error = new Error();

    // Act
    handleSubmitError(error);

    // Assert
    expect(toast.error).toHaveBeenCalledWith("Something went wrong");
  });
});
