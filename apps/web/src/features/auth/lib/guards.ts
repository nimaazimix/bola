import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "#/shared/stores";

export function requireAuth(locationHref: string) {
  const isAuthenticated = useAuthStore.getState().isAuthenticated;

  const redirectParam = locationHref === "/app" ? undefined : locationHref;
  if (!isAuthenticated) {
    throw redirect({
      to: "/signin",
      search: { redirect: redirectParam },
      replace: true,
    });
  }
}

export function requireGuest() {
  const isAuthenticated = useAuthStore.getState().isAuthenticated;

  if (isAuthenticated) {
    throw redirect({
      to: "/app",
      replace: true,
    });
  }
}
