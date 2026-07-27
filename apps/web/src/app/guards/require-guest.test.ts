import { useAuthStore } from "#/shared/stores";
import { resolveDestination } from "#/features/auth";
import { requireGuest } from "./require-guest";

vi.mock("@tanstack/react-router", () => ({
  redirect: vi.fn((options) => ({
    type: "redirect",
    ...options,
  })),
}));

vi.mock("#/features/auth", () => ({
  resolveDestination: vi.fn(),
}));

describe("requireGuest", () => {
  it("should pass when user is unauthenticated", async () => {
    // Arrange
    useAuthStore.setState({ isAuthenticated: false });

    // Act, Assert
    await expect(requireGuest({ queryClient: {} as never })).resolves.toBeUndefined();
    expect(resolveDestination).not.toHaveBeenCalled();
  });

  it("should throw redirect to the resolved route when user is authenticated", () => {
    // Arrange
    useAuthStore.setState({ isAuthenticated: true });
    vi.mocked(resolveDestination).mockResolvedValue({ to: "/onboarding" });

    // Act, Assert
    expect(requireGuest({ queryClient: {} as never })).rejects.toMatchObject({
      type: "redirect",
      to: "/onboarding",
      replace: true,
    });
  });
});
