import { createFileRoute, redirect } from "@tanstack/react-router";
import { resolveEntryRoute } from "#/app/navigation/resolve-entry-route";

export const Route = createFileRoute("/_authenticated/_onboarded")({
  beforeLoad: async () => {
    const entry = await resolveEntryRoute();
    if (entry.to === "/onboarding") {
      throw redirect({ ...entry, replace: true });
    }
  },
});
