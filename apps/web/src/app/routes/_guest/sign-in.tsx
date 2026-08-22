import { SignIn } from "#/features/auth";
import { createFileRoute } from "@tanstack/react-router";
import { AuthSearchSchema } from "#/app/navigation/schema";
import { resolveEntryRoute } from "#/app/navigation/resolve-entry-route";

export const Route = createFileRoute("/_guest/sign-in")({
  validateSearch: AuthSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { redirect } = Route.useSearch();
  const navigate = Route.useNavigate();

  async function handleSignIn() {
    const entry = await resolveEntryRoute(redirect);
    navigate({ ...entry, replace: true });
  }

  return (
    <div className="centered min-h-svh">
      <SignIn onSignIn={handleSignIn} redirect={redirect} />
    </div>
  );
}
