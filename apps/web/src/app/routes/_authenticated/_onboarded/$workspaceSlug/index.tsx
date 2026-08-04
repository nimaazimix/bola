import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_onboarded/$workspaceSlug/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Home</div>;
}
