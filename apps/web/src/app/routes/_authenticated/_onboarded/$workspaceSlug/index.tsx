import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_onboarded/$workspaceSlug/")({
  component: () => <Navigate from="/$workspaceSlug/" to="/$workspaceSlug/home" replace />,
});
