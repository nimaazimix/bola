import { linkOptions } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

// Intentional cross import
import { workspaceQueries } from "#/features/workspaces";

export async function resolveDestination(queryClient: QueryClient, redirect?: string) {
  if (redirect) {
    return linkOptions({ to: redirect });
  }

  const workspaces = await queryClient.ensureQueryData(workspaceQueries.list());

  if (!workspaces.length) {
    return linkOptions({ to: "/onboarding" });
  }

  return linkOptions({
    to: "/$workspaceSlug",
    params: { workspaceSlug: workspaces[0]!.slug },
  });
}
