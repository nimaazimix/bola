import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "#/shared/stores";

interface RequireAuthParameters {
  locationHref: string;
}

export function requireAuth({ locationHref }: RequireAuthParameters) {
  const isAuthenticated = useAuthStore.getState().isAuthenticated;

  if (!isAuthenticated) {
    throw redirect({
      to: "/signin",
      search: { redirect: locationHref },
      replace: true,
    });
  }
}
