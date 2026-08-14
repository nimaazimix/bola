import { render, screen, userEvent, waitFor } from "#/test/utils";
import { predicates, server } from "#/test/mocks";
import { http, HttpResponse } from "msw";
import { CreateBoardDialog } from "./create-board-dialog";
import { boardFactory } from "#/test/factories";

describe("CreateBoardDialog", () => {
  it("should open the dialog when the trigger is clicked", async () => {
    // Arrange
    const onCreateBoard = vi.fn();
    render(
      <CreateBoardDialog
        trigger={<button>Open Dialog</button>}
        workspaceSlug="acme"
        onCreateBoard={onCreateBoard}
      />,
    );
    const user = userEvent.setup();

    // Act
    await user.click(screen.getByRole("button", { name: /open Dialog/i }));

    // Assert
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create board/i })).toBeInTheDocument();
  });

  it("should create a board, call the provided callback, and close the dialog", async () => {
    // Arrange
    let requestBody: unknown;
    server.use(
      http.post(predicates.api.boards.all, async ({ request }) => {
        requestBody = await request.json();
        return HttpResponse.json({
          success: true,
          data: boardFactory.build({ id: "brd_id" }),
        });
      }),
    );

    const onCreateBoard = vi.fn();
    render(
      <CreateBoardDialog
        trigger={<button>Open Dialog</button>}
        workspaceSlug="acme"
        onCreateBoard={onCreateBoard}
      />,
    );
    const user = userEvent.setup();

    // Act
    await user.click(screen.getByRole("button", { name: /open dialog/i }));
    await user.type(screen.getByLabelText(/name/i), "Product Planning");
    await user.click(screen.getByRole("button", { name: /create board/i }));

    // Assert
    await waitFor(() => {
      expect(onCreateBoard).toHaveBeenCalledWith("brd_id");
    });
    expect(requestBody).toEqual({ name: "Product Planning" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
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
    render(
      <CreateBoardDialog
        trigger={<button>Open Dialog</button>}
        workspaceSlug="acme"
        onCreateBoard={onCreateBoard}
      />,
    );
    const user = userEvent.setup();

    // Act
    await user.click(screen.getByRole("button", { name: /open dialog/i }));
    await user.click(screen.getByRole("button", { name: /create board/i }));

    // Assert
    expect(screen.getByLabelText(/name/i)).toHaveAttribute("data-invalid", "true");
    expect(screen.getByText(/please enter a name/i)).toBeInTheDocument();

    expect(requestSent).toBe(false);
    expect(onCreateBoard).not.toHaveBeenCalled();
  });

  it("should display server error message when the request fails with an exception", async () => {
    // Arrange
    server.use(
      http.post(predicates.api.boards.all, () => {
        return HttpResponse.json(
          {
            success: false,
            error: {
              code: "board.unknown_error",
              message: "Something went wrong when creating a board",
            },
          },
          { status: 409 },
        );
      }),
    );

    const onCreateBoard = vi.fn();
    render(
      <CreateBoardDialog
        trigger={<button>Open Dialog</button>}
        workspaceSlug="acme"
        onCreateBoard={onCreateBoard}
      />,
    );
    const user = userEvent.setup();

    // Act
    await user.click(screen.getByRole("button", { name: /open dialog/i }));
    await user.type(screen.getByLabelText(/name/i), "Product Planning");
    await user.click(screen.getByRole("button", { name: /create board/i }));

    // Assert
    expect(
      await screen.findByText("Something went wrong when creating a board"),
    ).toBeInTheDocument();
    expect(onCreateBoard).not.toHaveBeenCalled();
  });

  it("should display generic error message when something unexpected happens", async () => {
    // Arrange
    const onCreateBoard = vi.fn().mockThrow(new Error());
    render(
      <CreateBoardDialog
        trigger={<button>Open Dialog</button>}
        workspaceSlug="acme"
        onCreateBoard={onCreateBoard}
      />,
    );
    const user = userEvent.setup();

    // Act
    await user.click(screen.getByRole("button", { name: /open dialog/i }));
    await user.type(screen.getByLabelText(/name/i), "Product Planning");
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
    render(
      <CreateBoardDialog
        trigger={<button>Open Dialog</button>}
        workspaceSlug="acme"
        onCreateBoard={onCreateBoard}
      />,
    );
    const user = userEvent.setup();

    // Act
    await user.click(screen.getByRole("button", { name: /open dialog/i }));
    await user.type(screen.getByLabelText(/name/i), "Product Planning");
    await user.click(screen.getByRole("button", { name: /create board/i }));

    // Assert
    expect(await screen.findByRole("button", { name: /creating board/i })).toBeDisabled();

    resolveRequest();

    expect(await screen.findByRole("button", { name: /create board/i })).toBeEnabled();
  });
});
