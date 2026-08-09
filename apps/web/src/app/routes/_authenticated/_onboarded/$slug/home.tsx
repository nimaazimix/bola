import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_onboarded/$slug/home")({
  staticData: {
    title: "Home",
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div></div>;
}
