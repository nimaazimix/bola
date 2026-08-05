import { SignIn } from "#/features/auth";

import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { resolveEntryRoute } from "#/app/navigation/resolve-entry-route";
import { z } from "zod";

export const Route = createFileRoute("/_guest/signin")({
  validateSearch: z.object({
    redirect: z.string().nonempty().optional().catch(undefined),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { redirect } = Route.useSearch();
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();

  async function handleSignIn() {
    const entry = await resolveEntryRoute(queryClient, redirect);
    navigate({ ...entry, replace: true });
  }

  return (
    <div className="centered min-h-svh">
      <SignIn onSignIn={handleSignIn} redirect={redirect} />
    </div>
  );
}
