import { Loader } from "@bola/ui/components/loader";

import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useVerifyEmail } from "#/features/auth";
import { VerifyEmailSearchSchema } from "../navigation/schema";
import { resolveEntryRoute } from "../navigation/resolve-entry-route";

export const Route = createFileRoute("/verify-email")({
  validateSearch: VerifyEmailSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { token, redirect } = Route.useSearch();
  const navigate = Route.useNavigate();

  const { mutateAsync: verifyEmail } = useVerifyEmail();

  useEffect(() => {
    async function verify() {
      if (!token) {
        return navigate({ to: "/sign-in", search: { redirect }, replace: true });
      }

      try {
        await verifyEmail({ input: { token } });

        const entry = await resolveEntryRoute(redirect);
        navigate({ ...entry, replace: true });
      } catch {
        navigate({ to: "/sign-in", search: { redirect }, replace: true });
      }
    }

    verify();
  }, [navigate, redirect, token, verifyEmail]);

  return (
    <div className="centered min-h-dvh">
      <Loader />
    </div>
  );
}
