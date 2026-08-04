import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "#/shared/stores/auth.store";
import { resolveDestination } from "#/features/auth";

export const Route = createFileRoute("/_guest")({
  beforeLoad: async ({ context: { queryClient } }) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (isAuthenticated) {
      const destination = await resolveDestination(queryClient);
      throw redirect({ ...destination, replace: true });
    }
  },
});
