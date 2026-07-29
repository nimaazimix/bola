import { SignIn } from "#/features/auth";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/_guest/signin")({
  validateSearch: z.object({
    redirect: z.string().nonempty().optional().catch(undefined),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="centered min-h-svh">
      <SignIn />
    </div>
  );
}
