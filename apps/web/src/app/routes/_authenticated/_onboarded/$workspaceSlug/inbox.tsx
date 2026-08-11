import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_onboarded/$workspaceSlug/inbox")({
  staticData: {
    title: "Inbox",
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div></div>;
}
