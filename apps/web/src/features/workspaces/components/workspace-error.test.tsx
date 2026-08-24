import { render, screen } from "#/testing/utils";
import { ApiError } from "#/shared/api/errors";
import { WorkspaceError } from "./workspace-error";

vi.mock("@tanstack/react-router", () => ({
  ErrorComponent: ({ error }: { error: Error }) => (
    <div data-testid="error-component">{error.message}</div>
  ),
}));

describe("WorkspaceError", () => {
  it("should render the default error component for non-api errors", async () => {
    // Arrange
    const error = new Error();
    render(<WorkspaceError error={error} onGoHome={vi.fn()} onRetry={vi.fn()} />);

    // Assert
    expect(screen.getByTestId("error-component")).toBeInTheDocument();
  });

  it("should render not found state for api errors with 404 status code", async () => {
    // Arrange
    const error = new ApiError({ kind: "http", status: 404, message: "..." });
    render(<WorkspaceError error={error} onGoHome={vi.fn()} onRetry={vi.fn()} />);

    // Assert
    expect(screen.getByText(/workspace not found/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /go home/i })).toBeInTheDocument();
  });

  it("should render network error state for api errors of kind network", async () => {
    // Arrange
    const error = new ApiError({ kind: "network", message: "..." });
    render(<WorkspaceError error={error} onGoHome={vi.fn()} onRetry={vi.fn()} />);

    // Assert
    expect(screen.getByText(/unable to connect to the server/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("should render unknown error state for api errors of kind unknown", async () => {
    // Arrange
    const error = new ApiError({ kind: "unknown", message: "..." });
    render(<WorkspaceError error={error} onGoHome={vi.fn()} onRetry={vi.fn()} />);

    // Assert
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });
});
