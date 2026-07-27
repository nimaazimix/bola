import { WorkspaceOnboarding } from "#/features/workspaces";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/onboarding")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="centered min-h-svh">
      <WorkspaceOnboarding />
    </div>
  );
}
