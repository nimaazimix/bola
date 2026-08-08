import { SidebarProvider, SidebarTrigger } from "@bola/ui/components/sidebar";
import { AppSidebar } from "#/widgets/app-sidebar";

import {
  createFileRoute,
  Outlet,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { WorkspaceErrorState, workspaceQueries } from "#/features/workspaces";
import { resolveEntryRoute } from "#/app/navigation/resolve-entry-route";

export const Route = createFileRoute("/_authenticated/_onboarded/$workspaceSlug")({
  loader: async ({ context: { queryClient }, params }) => {
    await Promise.all([
      queryClient.ensureQueryData(workspaceQueries.detail(params.workspaceSlug)),
      queryClient.ensureQueryData(workspaceQueries.list()),
    ]);
  },
  component: RouteComponent,
  errorComponent: ErrorComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="px-4">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

function ErrorComponent({ error }: ErrorComponentProps) {
  const navigate = Route.useNavigate();
  const router = useRouter();

  async function handleNavigate() {
    const entry = await resolveEntryRoute();
    navigate(entry);
  }

  return (
    <WorkspaceErrorState
      error={error}
      onNavigate={handleNavigate}
      onRetry={() => router.invalidate()}
    />
  );
}
