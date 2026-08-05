import { WorkspaceOnboarding } from "#/features/workspaces";

import { createFileRoute, redirect } from "@tanstack/react-router";
import { resolveEntryRoute } from "#/app/navigation/resolve-entry-route";

export const Route = createFileRoute("/_authenticated/onboarding")({
  beforeLoad: async ({ context: { queryClient } }) => {
    const entry = await resolveEntryRoute(queryClient);
    if (entry.to !== "/onboarding") {
      throw redirect({ ...entry, replace: true });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="centered min-h-svh">
      <WorkspaceOnboarding />
    </div>
  );
}
