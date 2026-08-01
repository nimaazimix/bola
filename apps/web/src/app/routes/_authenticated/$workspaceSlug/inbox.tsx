import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/$workspaceSlug/inbox")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Inbox</div>;
}
