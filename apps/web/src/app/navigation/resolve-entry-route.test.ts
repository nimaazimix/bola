import type { QueryClient } from "@tanstack/react-query";
import { resolveEntryRoute } from "./resolve-entry-route";

describe("resolveEntryRoute", () => {
  it("should resolve to the redirect route when provided", async () => {
    // Arrange
    const queryClient = {
      ensureQueryData: vi.fn(),
    } as unknown as QueryClient;

    // Act
    const result = await resolveEntryRoute(queryClient, "/acme");

    // Assert
    expect(result).toEqual({ to: "/acme" });
    expect(queryClient.ensureQueryData).not.toHaveBeenCalled();
  });

  it("should resolve to the onboarding route when user has no workspace", async () => {
    // Arrange
    const queryClient = {
      ensureQueryData: vi.fn(() => []),
    } as unknown as QueryClient;

    // Act
    const result = await resolveEntryRoute(queryClient);

    // Assert
    expect(result).toEqual({ to: "/onboarding" });
    expect(queryClient.ensureQueryData).toHaveBeenCalled();
  });

  it("should resolve to the first workspace route when user already has workspaces", async () => {
    // Assert
    const queryClient = {
      ensureQueryData: vi.fn(() => [{ slug: "acme" }, { slug: "personal" }]),
    } as unknown as QueryClient;

    // Act
    const result = await resolveEntryRoute(queryClient);

    // Assert
    expect(result).toEqual({
      to: "/$workspaceSlug",
      params: { workspaceSlug: "acme" },
    });
    expect(queryClient.ensureQueryData).toHaveBeenCalled();
  });
});
