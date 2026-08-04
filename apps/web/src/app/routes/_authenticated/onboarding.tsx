import { WorkspaceOnboarding } from "#/features/workspaces";

import { createFileRoute, redirect } from "@tanstack/react-router";
import { resolveDestination } from "#/features/auth";

export const Route = createFileRoute("/_authenticated/onboarding")({
  beforeLoad: async ({ context: { queryClient } }) => {
    const destination = await resolveDestination(queryClient);
    if (destination.to !== "/onboarding") {
      throw redirect({ ...destination, replace: true });
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
