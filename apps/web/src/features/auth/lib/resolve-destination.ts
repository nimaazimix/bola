import type { ToOptions } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { workspaceQueries } from "#/shared/api";

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
