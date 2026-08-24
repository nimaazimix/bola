import { render, screen } from "#/testing/utils";
import { ApiError } from "#/shared/api/errors";
import { BoardError } from "./board-error";

vi.mock("@tanstack/react-router", () => ({
  ErrorComponent: ({ error }: { error: Error }) => (
    <div data-testid="error-component">{error.message}</div>
  ),
  Link: ({ children }: React.PropsWithChildren) => <a role="link">{children}</a>,
}));

describe("BoardError", () => {
  it("should render the default error component for non-api errors", async () => {
    // Arrange
    const error = new Error();
    render(<BoardError error={error} onRetry={vi.fn()} />);

    // Assert
    expect(screen.getByTestId("error-component")).toBeInTheDocument();
  });

  it("should render not found state for api errors with 404 status code", async () => {
    // Arrange
    const error = new ApiError({ kind: "http", status: 404, message: "..." });
    render(<BoardError error={error} onRetry={vi.fn()} />);

    // Assert
    expect(screen.getByText(/board not found/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view boards/i })).toBeInTheDocument();
  });

  it("should render network error state for api errors of kind network", async () => {
    // Arrange
    const error = new ApiError({ kind: "network", message: "..." });
    render(<BoardError error={error} onRetry={vi.fn()} />);

    // Assert
    expect(screen.getByText(/unable to connect to the server/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("should render unknown error state for api errors of kind unknown", async () => {
    // Arrange
    const error = new ApiError({ kind: "unknown", message: "..." });
    render(<BoardError error={error} onRetry={vi.fn()} />);

    // Assert
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });
});
