import { render, screen, userEvent, waitFor } from "#/test/utils";
import { AuthRoutes, server } from "#/test/mocks";
import { http, HttpResponse } from "msw";
import { useAuthStore } from "#/shared/stores";
import { SigninForm } from "./signin-form";

const navigateMock = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
}));

describe("SigninForm", () => {
  afterEach(() => {
    useAuthStore.setState(useAuthStore.getInitialState(), true);
  });

  it("should authenticate user and navigate to provided redirect route", async () => {
    // Arrange
    let requestBody: unknown;
    server.use(
      http.post(AuthRoutes.SIGNIN, async ({ request }) => {
        requestBody = await request.json();
        return HttpResponse.json({
          success: true,
          data: { accessToken: "access-token", user: {} },
        });
      }),
    );

    render(<SigninForm redirect="/app/settings" />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    // Assert
    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(navigateMock).toHaveBeenCalledWith(expect.objectContaining({ to: "/app/settings" }));
    });
    expect(requestBody).toEqual({ email: "test@example.com", password: "password" });
  });

  it("should authenticate user and navigate to /app when redirect route is not provided", async () => {
    // Arrange
    render(<SigninForm />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    // Assert
    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(navigateMock).toHaveBeenCalledWith(expect.objectContaining({ to: "/app" }));
    });
  });

  it("should not submit values when validation fails", async () => {
    // Arrange
    let requestSent = false;
    server.use(
      http.post(AuthRoutes.SIGNIN, () => {
        requestSent = true;
      }),
    );

    render(<SigninForm />);
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

  it("should show error message when signin fails", async () => {
    // Arrange
    server.use(
      http.post(AuthRoutes.SIGNIN, () => {
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

    render(<SigninForm />);
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
      http.post(AuthRoutes.SIGNIN, async () => {
        await new Promise<void>((resolve) => {
          resolveRequest = resolve;
        });
        return HttpResponse.json({ success: true });
      }),
    );

    render(<SigninForm />);
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
