import { render, screen, userEvent, waitFor } from "#/testing/utils";
import { boardFactory } from "#/testing/factories";
import { predicates, server } from "#/testing/mocks";
import { http, HttpResponse } from "msw";
import type { CreateBoardInput } from "@bola/contracts/boards";
import { BoardForm } from "./board-form";

vi.mock("#/shared/hooks/use-workspace-slug", () => ({
  useWorkspaceSlug: vi.fn().mockReturnValue("acme-inc"),
}));

describe("BoardForm", () => {
  it("should create board and call the provided onCreateBoard callback", async () => {
    // Arrange
    let requestBody!: CreateBoardInput;
    server.use(
      http.post(predicates.api.boards.all, async ({ request }) => {
        requestBody = (await request.json()) as CreateBoardInput;
        return HttpResponse.json({
          success: true,
          data: boardFactory.build({ id: "brd_id", name: requestBody.name }),
        });
      }),
    );

    const onCreateBoard = vi.fn();
    render(<BoardForm onCreateBoard={onCreateBoard} />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Design");
    await user.click(screen.getByRole("button", { name: /create board/i }));

    // Assert
    await waitFor(() => {
      expect(onCreateBoard).toHaveBeenCalledWith("brd_id");
    });
    expect(requestBody).toEqual({ name: "Design" });
  });

  it("should prevent form submission when validation fails", async () => {
    // Arrange
    let requestSent = false;
    server.use(
      http.post(predicates.api.boards.all, () => {
        requestSent = true;
      }),
    );

    const onCreateBoard = vi.fn();
    render(<BoardForm onCreateBoard={onCreateBoard} />);
    const user = userEvent.setup();

    // Act
    await user.click(screen.getByRole("button", { name: /create board/i }));

    // Assert
    expect(screen.getByLabelText(/name/i)).toHaveAttribute("data-invalid", "true");
    expect(screen.getByText(/please enter a name/i)).toBeInTheDocument();

    expect(onCreateBoard).not.toHaveBeenCalled();
    expect(requestSent).toBe(false);
  });

  it("should display server error message when the request fails with an exception", async () => {
    // Arrange
    server.use(
      http.post(predicates.api.boards.all, () => {
        return HttpResponse.json(
          {
            success: false,
            error: { code: "api_code", message: "api message" },
          },
          { status: 409 },
        );
      }),
    );

    const onCreateBoard = vi.fn();
    render(<BoardForm onCreateBoard={onCreateBoard} />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Design");
    await user.click(screen.getByRole("button", { name: /create board/i }));

    // Assert
    expect(await screen.findByText("api message")).toBeInTheDocument();
    expect(onCreateBoard).not.toHaveBeenCalled();
  });

  it("should display generic error message when something unexpected happens", async () => {
    // Arrange
    const onCreateBoard = vi.fn().mockThrow(new Error());
    render(<BoardForm onCreateBoard={onCreateBoard} />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Design");
    await user.click(screen.getByRole("button", { name: /create board/i }));

    // Assert
    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
  });

  it("should disable the submit button during form submission", async () => {
    // Arrange
    let resolveRequest!: () => void;
    server.use(
      http.post(predicates.api.boards.all, async () => {
        await new Promise<void>((resolve) => {
          resolveRequest = resolve;
        });
        return HttpResponse.json({ success: true });
      }),
    );

    const onCreateBoard = vi.fn();
    render(<BoardForm onCreateBoard={onCreateBoard} />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Design");
    await user.click(screen.getByRole("button", { name: /create board/i }));

    // Assert
    expect(await screen.findByRole("button", { name: /creating board/i })).toBeDisabled();

    resolveRequest();

    expect(await screen.findByRole("button", { name: /create board/i })).toBeEnabled();
  });
});
