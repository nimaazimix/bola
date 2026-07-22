import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "#/shared/stores";
import { requireAuth, requireGuest } from "./guards";

vi.mock("@tanstack/react-router", () => ({
  redirect: vi.fn(() => new Error()),
}));

afterEach(() => {
  useAuthStore.setState(useAuthStore.getInitialState(), true);
});

describe("requireAuth", () => {
  it("should pass when user is authenticated", () => {
    // Arrange
    useAuthStore.setState({ isAuthenticated: true });

    // Act, Assert
    expect(() => requireAuth("/app/settings")).not.toThrow();
  });

  it("should throw redirect to /auth/signin and set visited route as redirect when user is unauthenticated", () => {
    // Arrange
    useAuthStore.setState({ isAuthenticated: false });

    // Act, Arrange
    expect(() => requireAuth("/app/settings")).toThrow();
    expect(redirect).toHaveBeenCalledWith(
      expect.objectContaining({ to: "/auth/signin", search: { redirect: "/app/settings" } }),
    );
  });

  it("should not set visited route as redirect when it is /app", () => {
    // Arrange
    useAuthStore.setState({ isAuthenticated: false });

    // Act, Arrange
    expect(() => requireAuth("/app")).toThrow();
    expect(redirect).toHaveBeenCalledWith(
      expect.objectContaining({ to: "/auth/signin", search: { redirect: undefined } }),
    );
  });
});

describe("requireGuest", () => {
  it("should pass when user is unauthenticated", () => {
    // Arrange
    useAuthStore.setState({ isAuthenticated: false });

    // Act, Assert
    expect(() => requireGuest()).not.toThrow();
  });

  it("should throw redirect to /app when user is authenticated", () => {
    // Arrange
    useAuthStore.setState({ isAuthenticated: true });

    // Act, Assert
    expect(() => requireGuest()).toThrow();
    expect(redirect).toHaveBeenCalledWith(expect.objectContaining({ to: "/app" }));
  });
});
