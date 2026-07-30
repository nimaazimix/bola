import { render, screen, userEvent, waitFor } from "#/shared/test/utils";
import { predicates, server } from "#/shared/test/mocks";
import { http, HttpResponse } from "msw";
import { CreateWorkspaceForm } from "./create-workspace-form";

const navigateMock = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
}));

describe("CreateWorkspaceForm", () => {
  it("should automatically generate the slug", async () => {
    // Arrange
    render(<CreateWorkspaceForm />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Acme Inc");

    // Assert
    expect(screen.getByLabelText(/url/i)).toHaveValue("acme-inc");
  });

  it("should stop auto-generating the slug after the user edits it", async () => {
    // Arrange
    render(<CreateWorkspaceForm />);
    const user = userEvent.setup();

    // Act
    const nameField = screen.getByLabelText(/name/i);
    const slugField = screen.getByLabelText(/url/i);

    await user.type(nameField, "Acme");

    await user.type(slugField, "-inc");

    await user.clear(nameField);
    await user.type(nameField, "Another");

    // Assert
    expect(slugField).toHaveValue("acme-inc");
  });

  it("should create a workspace and navigate to it", async () => {
    // Arrange
    let requestBody: unknown;
    server.use(
      http.post(predicates.api.workspaces.all, async ({ request }) => {
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

  it("should prevent form submission when validation fails", async () => {
    // Arrange
    let requestSent = false;
    server.use(
      http.post(predicates.api.workspaces.all, () => {
        requestSent = true;
      }),
    );

    render(<CreateWorkspaceForm />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Acme Inc");
    await user.type(screen.getByLabelText(/url/i), "-");
    await user.click(screen.getByRole("button", { name: /create workspace/i }));

    // Assert
    expect(screen.getByLabelText(/url/i)).toHaveAttribute("data-invalid", "true");
    expect(screen.getByText(/non-consecutive hyphens/i)).toBeInTheDocument();

    expect(requestSent).toBe(false);
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("should display server error message when the request fails with an exception", async () => {
    // Arrange
    server.use(
      http.post(predicates.api.workspaces.all, () => {
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
    expect(await screen.findByText("Slug is already in use")).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("should display fallback error message when the request fails unexpectedly", async () => {
    // Arrange
    server.use(
      http.post(predicates.api.workspaces.all, () => {
        return HttpResponse.error();
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

  it("should prevent form submission when the slug is unavailable", async () => {
    // Arrange
    let requestSent = false;
    server.use(
      http.post(predicates.api.workspaces.all, () => {
        requestSent = true;
      }),
    );
    server.use(
      http.get(predicates.api.workspaces.checkSlug, async () => {
        return HttpResponse.json({ success: true, data: { available: false } });
      }),
    );

    render(<CreateWorkspaceForm />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Acme Inc");
    await user.click(screen.getByRole("button", { name: /create workspace/i }));

    // Assert
    expect(await screen.findByLabelText(/url/i)).toHaveAttribute("data-invalid", "true");
    expect(screen.getByText(/unavailable/i)).toBeInTheDocument();
    expect(requestSent).toBe(false);
  });

  it("should display generic validation error when slug availability cannot be verified", async () => {
    server.use(
      http.get(predicates.api.workspaces.checkSlug, async () => {
        return HttpResponse.error();
      }),
    );

    render(<CreateWorkspaceForm />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Acme Inc");
    await user.click(screen.getByRole("button", { name: /create workspace/i }));

    // Assert
    expect(await screen.findByLabelText(/url/i)).toHaveAttribute("data-invalid", "true");
    expect(screen.getByText(/unable to verify slug availability/i)).toBeInTheDocument();
  });

  it("should disable the submit button during form submission", async () => {
    // Arrange
    let resolveRequest!: () => void;
    server.use(
      http.post(predicates.api.workspaces.all, async () => {
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
