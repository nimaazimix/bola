import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_onboarded/$slug/settings")({
  staticData: {
    title: "Settings",
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div></div>;
}
