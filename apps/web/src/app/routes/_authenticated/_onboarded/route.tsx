import { createFileRoute, redirect } from "@tanstack/react-router";
import { resolveDestination } from "#/features/auth";

export const Route = createFileRoute("/_authenticated/_onboarded")({
  beforeLoad: async ({ context: { queryClient } }) => {
    const destination = await resolveDestination(queryClient);
    if (destination.to === "/onboarding") {
      throw redirect({ ...destination, replace: true });
    }
  },
});
