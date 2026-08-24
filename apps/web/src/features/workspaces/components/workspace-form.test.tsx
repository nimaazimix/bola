import { render, screen, userEvent, waitFor } from "#/testing/utils";
import { predicates, server } from "#/testing/mocks";
import { workspaceFactory } from "#/testing/factories";
import { http, HttpResponse } from "msw";
import type { CreateWorkspaceInput } from "@bola/contracts/workspaces";
import { WorkspaceForm } from "./workspace-form";

describe("WorkspaceForm", () => {
  it("should automatically generate the slug", async () => {
    // Arrange
    const onCreateWorkspace = vi.fn();
    render(<WorkspaceForm onCreateWorkspace={onCreateWorkspace} />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Acme Inc");

    // Assert
    expect(screen.getByLabelText(/url/i)).toHaveValue("acme-inc");
  });

  it("should stop auto-generating the slug after user changes it manually", async () => {
    // Arrange
    const onCreateWorkspace = vi.fn();
    render(<WorkspaceForm onCreateWorkspace={onCreateWorkspace} />);
    const user = userEvent.setup();

    // Act
    const nameField = screen.getByLabelText(/name/i);
    const slugField = screen.getByLabelText(/url/i);

    await user.type(nameField, "Acme"); // slug: acme
    await user.type(slugField, "-inc"); // slug: acme-inc

    await user.clear(nameField);
    await user.type(nameField, "A");

    // Assert
    expect(slugField).toHaveValue("acme-inc");
  });

  it("should create a workspace and call the provided onCreateWorkspace callback", async () => {
    // Arrange
    let requestBody!: CreateWorkspaceInput;
    server.use(
      http.post(predicates.api.workspaces.all, async ({ request }) => {
        requestBody = (await request.json()) as CreateWorkspaceInput;
        return HttpResponse.json({
          success: true,
          data: workspaceFactory.build({ name: requestBody.name, slug: requestBody.slug }),
        });
      }),
    );

    const onCreateWorkspace = vi.fn();
    render(<WorkspaceForm onCreateWorkspace={onCreateWorkspace} />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Acme Inc"); // slug: acme-inc
    await user.click(screen.getByRole("button", { name: /create workspace/i }));

    await waitFor(() => {
      expect(onCreateWorkspace).toHaveBeenCalledWith("acme-inc");
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

    const onCreateWorkspace = vi.fn();
    render(<WorkspaceForm onCreateWorkspace={onCreateWorkspace} />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Acme"); // slug: acme
    await user.type(screen.getByLabelText(/url/i), "-"); // slug: acme-
    await user.click(screen.getByRole("button", { name: /create workspace/i }));

    // Assert
    expect(screen.getByLabelText(/url/i)).toHaveAttribute("data-invalid", "true");
    expect(
      screen.getByText(
        /slug must contain lowercase letters, numbers, and non-consecutive hyphens/i,
      ),
    ).toBeInTheDocument();

    expect(onCreateWorkspace).not.toHaveBeenCalled();
    expect(requestSent).toBe(false);
  });

  it("should display server error message when the request fails with an exception", async () => {
    // Arrange
    server.use(
      http.post(predicates.api.workspaces.all, () => {
        return HttpResponse.json(
          {
            success: false,
            error: { code: "api_code", message: "api message" },
          },
          { status: 409 },
        );
      }),
    );

    const onCreateWorkspace = vi.fn();
    render(<WorkspaceForm onCreateWorkspace={onCreateWorkspace} />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Acme Inc"); // slug: acme-inc
    await user.click(screen.getByRole("button", { name: /create workspace/i }));

    // Assert
    expect(await screen.findByText("api message")).toBeInTheDocument();
    expect(onCreateWorkspace).not.toHaveBeenCalled();
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

    const onCreateWorkspace = vi.fn();
    render(<WorkspaceForm onCreateWorkspace={onCreateWorkspace} />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Acme Inc"); // slug: acme-inc
    await user.click(screen.getByRole("button", { name: /create workspace/i }));

    // Assert
    expect(await screen.findByLabelText(/url/i)).toHaveAttribute("data-invalid", "true");
    expect(screen.getByText(/this workspace url is unavailable/i)).toBeInTheDocument();

    expect(onCreateWorkspace).not.toHaveBeenCalled();
    expect(requestSent).toBe(false);
  });

  it("should display generic validation error when slug availability cannot be verified", async () => {
    // Arrange
    server.use(
      http.get(predicates.api.workspaces.checkSlug, async () => {
        return HttpResponse.error();
      }),
    );

    const onCreateWorkspace = vi.fn();
    render(<WorkspaceForm onCreateWorkspace={onCreateWorkspace} />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Acme Inc"); // slug: acme-inc
    await user.click(screen.getByRole("button", { name: /create workspace/i }));

    // Assert
    expect(await screen.findByLabelText(/url/i)).toHaveAttribute("data-invalid", "true");
    expect(screen.getByText(/unable to verify slug availability/i)).toBeInTheDocument();
  });

  it("should display generic error message when something unexpected happens", async () => {
    // Arrange
    const onCreateWorkspace = vi.fn().mockThrow(new Error());
    render(<WorkspaceForm onCreateWorkspace={onCreateWorkspace} />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Acme Inc"); // slug: acme-inc
    await user.click(screen.getByRole("button", { name: /create workspace/i }));

    // Assert
    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
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

    const onCreateWorkspace = vi.fn();
    render(<WorkspaceForm onCreateWorkspace={onCreateWorkspace} />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Acme Inc"); // slug: acme-inc
    await user.click(screen.getByRole("button", { name: /create workspace/i }));

    // Assert
    expect(await screen.findByRole("button", { name: /creating workspace/i })).toBeDisabled();

    resolveRequest();

    expect(await screen.findByRole("button", { name: /create workspace/i })).toBeEnabled();
  });
});
