import { Loader } from "@bola/ui/components/loader";
import { createFileRoute } from "@tanstack/react-router";
import { useEmailVerification } from "#/features/auth";
import { z } from "zod";

export const Route = createFileRoute("/auth/verify-email")({
  validateSearch: z.object({
    token: z.string().nonempty().optional().catch(undefined),
    redirect: z.string().nonempty().optional().catch(undefined),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  useEmailVerification({ token: search.token, redirect: search.redirect });

  return (
    <div className="centered min-h-screen">
      <Loader />
    </div>
  );
}
