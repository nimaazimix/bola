import { SignUp } from "#/features/auth";
import { createFileRoute } from "@tanstack/react-router";
import { AuthSearchSchema } from "#/app/navigation/schema";

export const Route = createFileRoute("/_guest/signup")({
  validateSearch: AuthSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { redirect } = Route.useSearch();

  return (
    <div className="centered min-h-svh">
      <SignUp redirect={redirect} />
    </div>
  );
}
