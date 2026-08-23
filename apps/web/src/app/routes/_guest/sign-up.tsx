import { SignUp } from "#/features/auth";

import { createFileRoute } from "@tanstack/react-router";
import { AuthSearchSchema } from "#/app/navigation/schema";

export const Route = createFileRoute("/_guest/sign-up")({
  validateSearch: AuthSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="centered min-h-dvh">
      <SignUp />
    </div>
  );
}
