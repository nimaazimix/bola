import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "#/shared/stores";
import { resolveDestination } from "#/features/auth";

export const Route = createFileRoute("/_guest")({
  beforeLoad: async ({ context }) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (isAuthenticated) {
      const destination = await resolveDestination(context.queryClient);
      throw redirect({ ...destination, replace: true });
    }
  },
  component: Outlet,
});
