import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_onboarded/$workspaceSlug/inbox")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Inbox</div>;
}
