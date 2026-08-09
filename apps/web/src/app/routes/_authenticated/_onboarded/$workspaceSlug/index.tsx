import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_onboarded/$workspaceSlug/")({
  staticData: {
    title: "Home",
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div></div>;
}
