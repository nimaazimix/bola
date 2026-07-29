import { render, screen, userEvent, waitFor } from "#/shared/test/utils";
import { predicates, server } from "#/shared/test/mocks";
import { http, HttpResponse } from "msw";
import type { ToOptions } from "@tanstack/react-router";
import { useAuthStore } from "#/shared/stores";
import { resolveDestination } from "../lib/resolve-destination";
import { SignInForm } from "./sign-in-form";

const navigateMock = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
}));

vi.mock("../lib/resolve-destination", () => ({
  resolveDestination: vi.fn(),
}));

describe("SignInForm", () => {
  afterEach(() => {
    useAuthStore.setState(useAuthStore.getInitialState(), true);
  });

  it("should authenticate user and navigate to the resolved route", async () => {
    // Arrange
    let requestBody: unknown;
    server.use(
      http.post(predicates.api.auth.signIn, async ({ request }) => {
        requestBody = await request.json();
        return HttpResponse.json({
          success: true,
          data: { accessToken: "access-token", user: {} },
        });
      }),
    );
    vi.mocked(resolveDestination).mockResolvedValue({ to: "/acme" } as unknown as ToOptions);

    render(<SignInForm redirect="/acme" />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    // Assert
    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(navigateMock).toHaveBeenCalledWith({ to: "/acme", replace: true });
    });
    expect(requestBody).toEqual({ email: "test@example.com", password: "password" });
  });

  it("should not submit values when validation fails", async () => {
    // Arrange
    let requestSent = false;
    server.use(
      http.post(predicates.api.auth.signIn, () => {
        requestSent = true;
      }),
    );

    render(<SignInForm />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/email/i), "invalid-email");
    await user.type(screen.getByLabelText(/password/i), "password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    // Assert
    expect(await screen.findByLabelText(/email/i)).toHaveAttribute("data-invalid", "true");

    expect(requestSent).toBe(false);
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("should show error message when sign in fails", async () => {
    // Arrange
    server.use(
      http.post(predicates.api.auth.signIn, () => {
        return HttpResponse.json(
          {
            success: false,
            error: {
              code: "auth.credentials_invalid",
              message: "Email address or password is incorrect",
            },
          },
          { status: 401 },
        );
      }),
    );

    render(<SignInForm />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrong-password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    // Assert
    expect(await screen.findByText(/incorrect/i)).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("should disable the submit button while submitting values", async () => {
    // Arrange
    let resolveRequest!: () => void;
    server.use(
      http.post(predicates.api.auth.signIn, async () => {
        await new Promise<void>((resolve) => {
          resolveRequest = resolve;
        });
        return HttpResponse.json({ success: true });
      }),
    );

    render(<SignInForm />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    // Assert
    expect(await screen.findByRole("button", { name: /signing in/i })).toBeDisabled();

    resolveRequest();

    expect(await screen.findByRole("button", { name: /sign in/i })).toBeEnabled();
  });
});
