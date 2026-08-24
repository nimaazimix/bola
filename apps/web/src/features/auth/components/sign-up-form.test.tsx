import { render, screen, userEvent, waitFor } from "#/testing/utils";
import { predicates, server } from "#/testing/mocks";
import { http, HttpResponse } from "msw";
import { SignUpForm } from "./sign-up-form";

describe("SignUpForm", () => {
  it("should request sign up and call the provided onSignUp callback", async () => {
    // Arrange
    let requestBody: unknown;
    server.use(
      http.post(predicates.api.auth.signUp, async ({ request }) => {
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
      expect(onSignUp).toHaveBeenCalledWith({ name: "Test", email: "test@example.com" });
    });
    expect(requestBody).toEqual({
      name: "Test",
      email: "test@example.com",
      password: "password",
    });
  });

  it("should send redirect as the request query param when it is provided", async () => {
    // Arrange
    let requestUrl!: string;
    server.use(
      http.post(predicates.api.auth.signUp, ({ request }) => {
        requestUrl = request.url;
        return HttpResponse.json({ success: true });
      }),
    );

    const onSignUp = vi.fn();
    render(<SignUpForm onSignUp={onSignUp} redirect="/acme" />);
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
    expect(requestUrl).toContain("redirect=%2Facme");
  });

  it("should prefill provided data", async () => {
    // Arrange
    const onSignUp = vi.fn();
    render(<SignUpForm onSignUp={onSignUp} data={{ name: "Test", email: "test@example.com" }} />);

    // Assert
    expect(screen.getByDisplayValue("Test")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
  });

  it("should prevent form submission when validation fails", async () => {
    // Arrange
    let requestSent = false;
    server.use(
      http.post(predicates.api.auth.signUp, () => {
        requestSent = true;
      }),
    );

    const onSignUp = vi.fn();
    render(<SignUpForm onSignUp={onSignUp} />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Test");
    await user.type(screen.getByLabelText(/email/i), "test");
    await user.type(screen.getByLabelText(/password/i), "pass");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    // Assert
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("data-invalid", "true");
    expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/password/i)).toHaveAttribute("data-invalid", "true");
    expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();

    expect(requestSent).toBe(false);
    expect(onSignUp).not.toHaveBeenCalled();
  });

  it("should display server error message when the request fails with an exception", async () => {
    // Arrange
    server.use(
      http.post(predicates.api.auth.signUp, () => {
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
    expect(await screen.findByText("Email address is already in use")).toBeInTheDocument();
    expect(onSignUp).not.toHaveBeenCalled();
  });

  it("should display generic error message when something unexpected happens", async () => {
    // Arrange
    const onSignUp = vi.fn().mockThrow(new Error());
    render(<SignUpForm onSignUp={onSignUp} />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Test");
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    // Assert
    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
  });

  it("should disable the submit button during form submission", async () => {
    // Arrange
    let resolveRequest!: () => void;
    server.use(
      http.post(predicates.api.auth.signUp, async () => {
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
