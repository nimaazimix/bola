// import { requireGuest } from "#/features/auth";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  beforeLoad: () => {
    // requireGuest();
  },
  component: Outlet,
});
