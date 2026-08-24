import { render, screen, userEvent, waitFor } from "#/testing/utils";
import { predicates, server } from "#/testing/mocks";
import { userFactory } from "#/testing/factories";
import { http, HttpResponse } from "msw";
import { useAuthStore } from "#/shared/stores/auth.store";
import { SignInForm } from "./sign-in-form";

describe("SignInForm", () => {
  afterEach(() => {
    useAuthStore.setState(useAuthStore.getInitialState(), true);
  });

  it("should authenticate user and call the provided onSignIn callback", async () => {
    // Arrange
    let requestBody: unknown;
    server.use(
      http.post(predicates.api.auth.signIn, async ({ request }) => {
        requestBody = await request.json();
        return HttpResponse.json({
          success: true,
          data: { accessToken: "access-token", user: userFactory.build() },
        });
      }),
    );

    const onSignIn = vi.fn();
    render(<SignInForm onSignIn={onSignIn} />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    // Assert
    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(onSignIn).toHaveBeenCalled();
    });
    expect(requestBody).toEqual({ email: "test@example.com", password: "password" });
  });

  it("should prevent form submission when validation fails", async () => {
    // Arrange
    let requestSent = false;
    server.use(
      http.post(predicates.api.auth.signIn, () => {
        requestSent = true;
      }),
    );

    const onSignIn = vi.fn();
    render(<SignInForm onSignIn={onSignIn} />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/email/i), "test");
    await user.type(screen.getByLabelText(/password/i), "password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    // Assert
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("data-invalid", "true");
    expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument();

    expect(requestSent).toBe(false);
    expect(onSignIn).not.toHaveBeenCalled();
  });

  it("should display server error message when the request fails with an exception", async () => {
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

    const onSignIn = vi.fn();
    render(<SignInForm onSignIn={onSignIn} />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    // Assert
    expect(await screen.findByText("Email address or password is incorrect")).toBeInTheDocument();
    expect(onSignIn).not.toHaveBeenCalled();
  });

  it("should display generic error message when something unexpected happens", async () => {
    // Arrange
    const onSignIn = vi.fn().mockThrow(new Error());
    render(<SignInForm onSignIn={onSignIn} />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    // Assert
    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
  });

  it("should disable the submit button during form submission", async () => {
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

    const onSignIn = vi.fn();
    render(<SignInForm onSignIn={onSignIn} />);
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
