import type { ToOptions } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

// Intentional cross import
import { workspaceQueries } from "#/features/workspaces";

export async function resolveDestination(
  queryClient: QueryClient,
  redirect?: string,
): Promise<ToOptions> {
  if (redirect) {
    return { to: redirect } as ToOptions;
  }

  const workspaces = await queryClient.ensureQueryData(workspaceQueries.list());

  if (!workspaces.length) {
    return { to: "/onboarding" };
  }

  return {
    to: "/$workspaceSlug",
    params: { workspaceSlug: workspaces[0]!.slug },
  };
}
