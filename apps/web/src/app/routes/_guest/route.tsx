import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "#/shared/stores/auth.store";
import { resolveEntryRoute } from "#/app/navigation/resolve-entry-route";

export const Route = createFileRoute("/_guest")({
  beforeLoad: async () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (isAuthenticated) {
      const entry = await resolveEntryRoute();
      throw redirect({ ...entry, replace: true });
    }
  },
});
