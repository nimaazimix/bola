import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requireAuth } from "#/app/guards";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ location }) => {
    requireAuth({ locationHref: location.href });
  },
  component: Outlet,
});
