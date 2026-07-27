import { render, screen, userEvent, waitFor } from "#/test/utils";
import { server, WorkspaceRoutes } from "#/test/mocks";
import { http, HttpResponse } from "msw";
import { CreateWorkspaceForm } from "./create-workspace-form";

const navigateMock = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
}));

describe("CreateWorkspaceForm", () => {
  it("should automatically generate slug", async () => {
    // Arrange
    render(<CreateWorkspaceForm />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Acme Inc");

    // Assert
    expect(screen.getByLabelText(/url/i)).toHaveValue("acme-inc");
  });

  it("should stop generating slug when user types manually", async () => {
    // Arrange
    render(<CreateWorkspaceForm />);
    const user = userEvent.setup();

    // Act
    const nameField = screen.getByLabelText(/name/i);
    const slugField = screen.getByLabelText(/url/i);

    await user.type(nameField, "Acme Inc");

    await user.clear(slugField);
    await user.type(slugField, "workspace-1");

    await user.clear(nameField);
    await user.type(nameField, "Workspace 2");

    // Assert
    expect(slugField).toHaveValue("workspace-1");
  });

  it("should create a workspace and navigate to it", async () => {
    // Arrange
    let requestBody: unknown;
    server.use(
      http.post(WorkspaceRoutes.CREATE, async ({ request }) => {
        requestBody = await request.json();
        return HttpResponse.json({
          success: true,
          data: { name: "Acme Inc", slug: "acme-inc" },
        });
      }),
    );

    render(<CreateWorkspaceForm />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Acme Inc");
    await user.click(screen.getByRole("button", { name: /create workspace/i }));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith({
        to: "/$workspaceSlug",
        params: {
          workspaceSlug: "acme-inc",
        },
      });
    });
    expect(requestBody).toEqual({ name: "Acme Inc", slug: "acme-inc" });
  });

  it("should not submit values when validation fails", async () => {
    // Arrange
    let requestSent = false;
    server.use(
      http.post(WorkspaceRoutes.CREATE, () => {
        requestSent = true;
      }),
    );

    render(<CreateWorkspaceForm />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Acme Inc");
    await user.type(screen.getByLabelText(/url/i), "Invalid Slug");
    await user.click(screen.getByRole("button", { name: /create workspace/i }));

    // Assert
    expect(await screen.findByLabelText(/url/i)).toHaveAttribute("data-invalid", "true");

    expect(requestSent).toBe(false);
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("should show error message when server fails", async () => {
    // Arrange
    server.use(
      http.post(WorkspaceRoutes.CREATE, () => {
        return HttpResponse.json(
          {
            success: false,
            error: {
              code: "common.internal_error",
              message: "Something went wrong",
            },
          },
          { status: 409 },
        );
      }),
    );

    render(<CreateWorkspaceForm />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Acme Inc");
    await user.click(screen.getByRole("button", { name: /create workspace/i }));

    // Assert
    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("should invalidate url field when server fails with slug_already_in_use", async () => {
    // Arrange
    server.use(
      http.post(WorkspaceRoutes.CREATE, () => {
        return HttpResponse.json(
          {
            success: false,
            error: {
              code: "workspace.slug_already_in_use",
              message: "Slug is already in use",
            },
          },
          { status: 409 },
        );
      }),
    );

    render(<CreateWorkspaceForm />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Acme Inc");
    await user.click(screen.getByRole("button", { name: /create workspace/i }));

    // Assert
    expect(await screen.findByLabelText(/url/i)).toHaveAttribute("data-invalid", "true");
    expect(screen.getByText(/already in use/i)).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("should disable the submit button while submitting values", async () => {
    // Arrange
    let resolveRequest!: () => void;
    server.use(
      http.post(WorkspaceRoutes.CREATE, async () => {
        await new Promise<void>((resolve) => {
          resolveRequest = resolve;
        });
        return HttpResponse.json({ success: true });
      }),
    );

    render(<CreateWorkspaceForm />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Acme Inc");
    await user.click(screen.getByRole("button", { name: /create workspace/i }));

    // Assert
    expect(await screen.findByRole("button", { name: /creating workspace/i })).toBeDisabled();

    resolveRequest();

    expect(await screen.findByRole("button", { name: /create workspace/i })).toBeEnabled();
  });
});
