import { render, screen, userEvent } from "#/test/utils";
import { ApiError } from "#/shared/api/errors";
import { WorkspaceErrorState } from "./workspace-error-state";

describe("WorkspaceErrorState", () => {
  it("should display not found when error status is 404", async () => {
    // Arrange
    const error = new ApiError({ kind: "http", status: 404, message: "..." });

    const onNavigate = vi.fn();
    const onRetry = vi.fn();
    render(<WorkspaceErrorState error={error} onNavigate={onNavigate} onRetry={onRetry} />);
    const user = userEvent.setup();

    // Act, Assert
    expect(screen.getByText(/workspace not found/i)).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /go to your workspace/i });
    expect(button).toBeInTheDocument();
    await user.click(button);

    expect(onNavigate).toHaveBeenCalled();
  });

  it("should display access denied when error status is 403", async () => {
    // Arrange
    const error = new ApiError({ kind: "http", status: 403, message: "..." });

    const onNavigate = vi.fn();
    const onRetry = vi.fn();
    render(<WorkspaceErrorState error={error} onNavigate={onNavigate} onRetry={onRetry} />);
    const user = userEvent.setup();

    // Act, Assert
    expect(screen.getByText(/you don't have access to this workspace/i)).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /go to your workspace/i });
    expect(button).toBeInTheDocument();
    await user.click(button);

    expect(onNavigate).toHaveBeenCalled();
  });

  it("should display network issue when error kind is network", async () => {
    // Arrange
    const error = new ApiError({ kind: "network", message: "..." });

    const onNavigate = vi.fn();
    const onRetry = vi.fn();
    render(<WorkspaceErrorState error={error} onNavigate={onNavigate} onRetry={onRetry} />);
    const user = userEvent.setup();

    // Act, Assert
    expect(screen.getByText(/unable to connect to the server/i)).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /retry/i });
    expect(button).toBeInTheDocument();
    await user.click(button);

    expect(onRetry).toHaveBeenCalled();
  });

  it("should display something went wrong when error kind is unknown", async () => {
    // Arrange
    const error = new ApiError({ kind: "unknown", message: "..." });

    const onNavigate = vi.fn();
    const onRetry = vi.fn();
    render(<WorkspaceErrorState error={error} onNavigate={onNavigate} onRetry={onRetry} />);
    const user = userEvent.setup();

    // Act, Assert
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /retry/i });
    expect(button).toBeInTheDocument();
    await user.click(button);

    expect(onRetry).toHaveBeenCalled();
  });

  it("should display something went wrong for non-api errors", async () => {
    // Arrange
    const error = new Error();

    const onNavigate = vi.fn();
    const onRetry = vi.fn();
    render(<WorkspaceErrorState error={error} onNavigate={onNavigate} onRetry={onRetry} />);
    const user = userEvent.setup();

    // Act, Assert
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /retry/i });
    expect(button).toBeInTheDocument();
    await user.click(button);

    expect(onRetry).toHaveBeenCalled();
  });
});
