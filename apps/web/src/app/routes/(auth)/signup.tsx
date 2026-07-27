import { SignUp } from "#/features/auth";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { requireGuest } from "#/app/guards";

export const Route = createFileRoute("/(auth)/signup")({
  validateSearch: z.object({
    redirect: z.string().nonempty().optional().catch(undefined),
  }),
  beforeLoad: async ({ context }) => {
    await requireGuest({ queryClient: context.queryClient });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="centered min-h-svh">
      <SignUp />
    </div>
  );
}
