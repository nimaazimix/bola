import { workspaceFactory } from "#/test/factories";
import { queryClient } from "#/shared/api/query-client";
import { resolveEntryRoute } from "./resolve-entry-route";

describe("resolveEntryRoute", () => {
  it("should resolve to the first workspace route", async () => {
    // Arrange
    const workspaces = workspaceFactory.buildList(2);
    vi.spyOn(queryClient, "ensureQueryData").mockResolvedValue(workspaces);

    // Act
    const result = await resolveEntryRoute();

    // Assert
    expect(result).toEqual({
      to: "/$workspaceSlug",
      params: { workspaceSlug: workspaces[0]!.slug },
    });
    expect(queryClient.ensureQueryData).toHaveBeenCalled();
  });

  it("should resolve to the redirect route when provided", async () => {
    // Arrange
    const workspaces = workspaceFactory.buildList(1);
    vi.spyOn(queryClient, "ensureQueryData").mockResolvedValue(workspaces);

    // Act
    const result = await resolveEntryRoute("/acme");

    // Assert
    expect(result).toEqual({ to: "/acme" });
    expect(queryClient.ensureQueryData).toHaveBeenCalled();
  });

  it("should always resolve to the onboarding route when user has no workspace", async () => {
    // Arrange
    vi.mocked(queryClient.ensureQueryData).mockResolvedValue([]);

    // Act
    const result = await resolveEntryRoute("/acme");

    // Assert
    expect(result).toEqual({ to: "/onboarding" });
    expect(queryClient.ensureQueryData).toHaveBeenCalled();
  });
});
