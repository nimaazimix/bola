import { redirect } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { useAuthStore } from "#/shared/stores";
import { resolveDestination } from "#/features/auth";

interface RequireGuestParameters {
  queryClient: QueryClient;
}

export async function requireGuest({ queryClient }: RequireGuestParameters) {
  const isAuthenticated = useAuthStore.getState().isAuthenticated;

  if (isAuthenticated) {
    const destination = await resolveDestination(queryClient);
    throw redirect({ ...destination, replace: true });
  }
}
