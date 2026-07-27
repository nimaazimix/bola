import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "#/shared/stores";
import { resolveDestination } from "./resolve-destination";
import { requireAuth, requireGuest } from "./guards";

vi.mock("@tanstack/react-router", () => ({
  redirect: vi.fn((options) => ({
    type: "redirect",
    ...options,
  })),
}));

vi.mock("./resolve-destination", () => ({
  resolveDestination: vi.fn(),
}));

afterEach(() => {
  useAuthStore.setState(useAuthStore.getInitialState(), true);
});

describe("requireAuth", () => {
  it("should pass when user is authenticated", () => {
    // Arrange
    useAuthStore.setState({ isAuthenticated: true });

    // Act, Assert
    expect(() => requireAuth("/acme")).not.toThrow();
  });

  it("should throw redirect to /signin and set visited route as redirect when user is unauthenticated", () => {
    // Arrange
    useAuthStore.setState({ isAuthenticated: false });

    // Act, Arrange
    expect(() => requireAuth("/acme")).toThrow();
    expect(redirect).toHaveBeenCalledWith({
      to: "/signin",
      search: { redirect: "/acme" },
      replace: true,
    });
  });
});

describe("requireGuest", () => {
  it("should pass when user is unauthenticated", async () => {
    // Arrange
    useAuthStore.setState({ isAuthenticated: false });

    // Act, Assert
    await expect(requireGuest({} as never)).resolves.toBeUndefined();
    expect(resolveDestination).not.toHaveBeenCalled();
  });

  it("should throw redirect to the resolved route when user is authenticated", () => {
    // Arrange
    useAuthStore.setState({ isAuthenticated: true });
    vi.mocked(resolveDestination).mockResolvedValue({ to: "/onboarding" });

    // Act, Assert
    expect(requireGuest({} as never)).rejects.toMatchObject({
      type: "redirect",
      to: "/onboarding",
      replace: true,
    });
  });
});
