import { requireGuest, SignIn } from "#/features/auth";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/(auth)/signin")({
  validateSearch: z.object({
    redirect: z.string().nonempty().optional().catch(undefined),
  }),
  beforeLoad: () => {
    requireGuest();
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="centered min-h-svh">
      <SignIn />
    </div>
  );
}
