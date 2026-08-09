import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_onboarded/$slug/")({
  component: () => <Navigate from="/$slug/" to="/$slug/home" replace />,
});
