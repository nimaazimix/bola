import { linkOptions } from "@tanstack/react-router";
import { queryClient } from "#/shared/api/query-client";
import { workspaceQueries } from "#/features/workspaces";

export async function resolveEntryRoute(redirect?: string) {
  const workspaces = await queryClient.ensureQueryData(workspaceQueries.list());

  if (!workspaces.length) {
    return linkOptions({ to: "/onboarding" });
  }

  if (redirect) {
    return linkOptions({ to: redirect });
  }

  return linkOptions({
    to: "/$slug",
    params: { slug: workspaces[0]!.slug },
  });
}
