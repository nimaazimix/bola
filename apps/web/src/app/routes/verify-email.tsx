import { Loader } from "@bola/ui/components/loader";

import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useVerifyEmail } from "#/features/auth";
import { resolveEntryRoute } from "../navigation/resolve-entry-route";
import { z } from "zod";

export const Route = createFileRoute("/verify-email")({
  validateSearch: z.object({
    token: z.string().nonempty().optional().catch(undefined),
    redirect: z.string().nonempty().optional().catch(undefined),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { token, redirect } = Route.useSearch();
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync: verifyEmail } = useVerifyEmail();

  useEffect(() => {
    async function verify() {
      if (!token) {
        return navigate({ to: "/signin", search: { redirect }, replace: true });
      }

      try {
        await verifyEmail({ input: { token } });

        const entry = await resolveEntryRoute(queryClient, redirect);
        navigate({ ...entry, replace: true });
      } catch {
        navigate({ to: "/signin", search: { redirect }, replace: true });
      }
    }

    verify();
  }, [navigate, queryClient, redirect, token, verifyEmail]);

  return (
    <div className="centered min-h-screen">
      <Loader />
    </div>
  );
}
