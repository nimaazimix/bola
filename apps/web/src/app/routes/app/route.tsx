import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requireAuth } from "#/features/auth";

export const Route = createFileRoute("/app")({
  beforeLoad: ({ location }) => {
    requireAuth(location.href);
  },
  component: Outlet,
});
