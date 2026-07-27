import { redirect } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { useAuthStore } from "#/shared/stores";
import { resolveDestination } from "./resolve-destination";

export function requireAuth(locationHref: string) {
  const isAuthenticated = useAuthStore.getState().isAuthenticated;

  if (!isAuthenticated) {
    throw redirect({
      to: "/signin",
      search: { redirect: locationHref },
      replace: true,
    });
  }
}

export async function requireGuest(queryClient: QueryClient) {
  const isAuthenticated = useAuthStore.getState().isAuthenticated;

  if (isAuthenticated) {
    const destination = await resolveDestination(queryClient);
    throw redirect({ ...destination, replace: true });
  }
}
