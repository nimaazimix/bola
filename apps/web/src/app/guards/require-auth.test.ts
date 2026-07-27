import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "#/shared/stores";
import { requireAuth } from "./require-auth";

vi.mock("@tanstack/react-router", () => ({
  redirect: vi.fn((options) => ({
    type: "redirect",
    ...options,
  })),
}));

describe("requireAuth", () => {
  afterEach(() => {
    useAuthStore.setState(useAuthStore.getInitialState(), true);
  });

  it("should pass when user is authenticated", () => {
    // Arrange
    useAuthStore.setState({ isAuthenticated: true });

    // Act, Assert
    expect(() => requireAuth({ locationHref: "/acme" })).not.toThrow();
  });

  it("should throw redirect to /signin and set visited route as redirect when user is unauthenticated", () => {
    // Arrange
    useAuthStore.setState({ isAuthenticated: false });

    // Act, Arrange
    expect(() => requireAuth({ locationHref: "/acme" })).toThrow();
    expect(redirect).toHaveBeenCalledWith({
      to: "/signin",
      search: { redirect: "/acme" },
      replace: true,
    });
  });
});
