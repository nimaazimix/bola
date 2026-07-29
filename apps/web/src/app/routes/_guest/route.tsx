import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requireGuest } from "#/app/guards";

export const Route = createFileRoute("/_guest")({
  beforeLoad: async ({ context }) => {
    await requireGuest({ queryClient: context.queryClient });
  },
  component: Outlet,
});
