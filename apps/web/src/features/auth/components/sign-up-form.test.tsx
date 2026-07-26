import { render, screen, userEvent, waitFor } from "#/test/utils";
import { AuthRoutes, server } from "#/test/mocks";
import { http, HttpResponse } from "msw";
import { SignUpForm } from "./sign-up-form";

describe("SignUpForm", () => {
  it("should request sign up and call provided onSignUp", async () => {
    // Arrange
    let requestBody: unknown;
    server.use(
      http.post(AuthRoutes.SIGNUP, async ({ request }) => {
        requestBody = await request.json();
        return HttpResponse.json({ success: true });
      }),
    );

    const onSignUp = vi.fn();
    render(<SignUpForm onSignUp={onSignUp} />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Test");
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    // Assert
    await waitFor(() => {
      expect(onSignUp).toHaveBeenCalled();
    });
    expect(requestBody).toEqual({
      name: "Test",
      email: "test@example.com",
      password: "password",
    });
  });

  it("should send redirect as request query param when it is provided", async () => {
    // Arrange
    let requestUrl!: string;
    server.use(
      http.post(AuthRoutes.SIGNUP, ({ request }) => {
        requestUrl = request.url;
        return HttpResponse.json({ success: true });
      }),
    );

    const onSignUp = vi.fn();
    render(<SignUpForm onSignUp={onSignUp} redirect="/app/settings" />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Test");
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    // Arrange
    await waitFor(() => {
      expect(onSignUp).toHaveBeenCalled();
    });
    expect(requestUrl).toContain("redirect=%2Fapp%2Fsettings");
  });

  it("should prefill provided data", async () => {
    // Arrange
    const onSignUp = vi.fn();
    render(<SignUpForm onSignUp={onSignUp} data={{ name: "Test", email: "test@example.com" }} />);

    // Assert
    expect(screen.getByDisplayValue("Test")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
  });

  it("should not submit values when validation fails", async () => {
    // Arrange
    let requestSent = false;
    server.use(
      http.post(AuthRoutes.SIGNUP, () => {
        requestSent = true;
      }),
    );

    const onSignUp = vi.fn();
    render(<SignUpForm onSignUp={onSignUp} />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Test");
    await user.type(screen.getByLabelText(/email/i), "invalid-email");
    await user.type(screen.getByLabelText(/password/i), "weak");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    // Assert
    expect(await screen.findByLabelText(/email/i)).toHaveAttribute("data-invalid", "true");
    expect(screen.getByLabelText(/password/i)).toHaveAttribute("data-invalid", "true");

    expect(requestSent).toBe(false);
    expect(onSignUp).not.toHaveBeenCalled();
  });

  it("should show error message when sign up fails", async () => {
    // Arrange
    server.use(
      http.post(AuthRoutes.SIGNUP, () => {
        return HttpResponse.json(
          {
            success: false,
            error: {
              code: "auth.email_already_in_use",
              message: "Email address is already in use",
            },
          },
          { status: 409 },
        );
      }),
    );

    const onSignUp = vi.fn();
    render(<SignUpForm onSignUp={onSignUp} />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Test");
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    // Assert
    expect(await screen.findByText(/already in use/i)).toBeInTheDocument();
    expect(onSignUp).not.toHaveBeenCalled();
  });

  it("should disable the submit button while submitting values", async () => {
    // Arrange
    let resolveRequest!: () => void;
    server.use(
      http.post(AuthRoutes.SIGNUP, async () => {
        await new Promise<void>((resolve) => {
          resolveRequest = resolve;
        });
        return HttpResponse.json({ success: true });
      }),
    );

    const onSignUp = vi.fn();
    render(<SignUpForm onSignUp={onSignUp} />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Test");
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");

    await user.click(screen.getByRole("button", { name: /sign up/i }));

    // Assert
    expect(await screen.findByRole("button", { name: /signing up/i })).toBeDisabled();

    resolveRequest();

    expect(await screen.findByRole("button", { name: /sign up/i })).toBeEnabled();
  });
});
