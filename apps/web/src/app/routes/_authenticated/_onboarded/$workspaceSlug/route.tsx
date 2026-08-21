import { SidebarInset, SidebarProvider } from "@bola/ui/components/sidebar";
import { Loader } from "@bola/ui/components/loader";
import { AppSidebar } from "#/widgets/app-sidebar";
import { AppHeader } from "#/widgets/app-header";

import {
  createFileRoute,
  Outlet,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { WorkspaceError, workspaceQueries } from "#/features/workspaces";
import { resolveEntryRoute } from "#/app/navigation/resolve-entry-route";

export const Route = createFileRoute("/_authenticated/_onboarded/$workspaceSlug")({
  loader: async ({ context: { queryClient }, params }) => {
    await Promise.all([
      queryClient.ensureQueryData(workspaceQueries.detail(params.workspaceSlug)),
      queryClient.ensureQueryData(workspaceQueries.list()),
    ]);
  },
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="w-full flex-1 overflow-hidden">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function ErrorComponent({ error }: ErrorComponentProps) {
  const navigate = Route.useNavigate();
  const router = useRouter();

  async function handleGoHome() {
    const entry = await resolveEntryRoute();
    navigate(entry);
  }

  return (
    <div className="centered min-h-dvh">
      <WorkspaceError error={error} onGoHome={handleGoHome} onRetry={router.invalidate} />
    </div>
  );
}

function PendingComponent() {
  return (
    <div className="centered min-h-dvh">
      <Loader />
    </div>
  );
}
