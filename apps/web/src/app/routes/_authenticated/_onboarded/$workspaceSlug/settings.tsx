import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_onboarded/$workspaceSlug/settings")({
  staticData: {
    title: "Settings",
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div></div>;
}
