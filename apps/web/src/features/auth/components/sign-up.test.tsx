import { render, screen, userEvent } from "#/shared/test/utils";
import { SignUp } from "./sign-up";

vi.mock("@tanstack/react-router", () => ({
  useSearch: vi.fn(() => ({})),
  Link: ({ children }: React.PropsWithChildren) => <a>{children}</a>,
}));

describe("SignUp", () => {
  it("should render the sign up form initially", async () => {
    // Arrange
    render(<SignUp />);

    // Assert
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  it("should transition to the verify email step after successful sign up", async () => {
    // Arrange
    render(<SignUp />);
    const user = userEvent.setup();

    // Act
    await user.type(screen.getByLabelText(/name/i), "Test");
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    // Assert
    expect(await screen.findByText(/check your email/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
  });

  it("should restore the entered data when returning to the sign up form", async () => {
    // Arrange
    render(<SignUp />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/name/i), "Test");
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    // Act
    await user.click(await screen.findByRole("button", { name: /back/i }));

    // Assert
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toHaveValue("Test");
    expect(screen.getByLabelText(/email/i)).toHaveValue("test@example.com");
    expect(screen.getByLabelText(/password/i)).toHaveValue("");
  });
});
