import { SidebarProvider, SidebarTrigger } from "@bola/ui/components/sidebar";
import { Button } from "@bola/ui/components/button";
import { ErrorState } from "#/shared/components/error-state";
import { AppSidebar } from "#/widgets/app-sidebar";
import {
  IconAlertTriangle,
  IconCloudOff,
  IconFolderOff,
  IconRefresh,
  IconShieldOff,
} from "@tabler/icons-react";

import {
  createFileRoute,
  Outlet,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { workspaceQueries } from "#/features/workspaces";
import { ApiError } from "#/shared/api/errors";
import { useQueryClient } from "@tanstack/react-query";
import { resolveDestination } from "#/features/auth";

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
  const queryClient = useQueryClient();

  async function handleNavigateToWorkspace() {
    const destination = await resolveDestination(queryClient);
    navigate(destination);
  }

  if (error instanceof ApiError) {
    if (error.status === 404) {
      return (
        <ErrorState
          icon={<IconFolderOff />}
          title="Workspace not found"
          message="We couldn't find the workspace you're trying to access. It may have been deleted, moved, or the link might be incorrect."
          className="min-h-svh"
        >
          <Button variant="outline" onClick={handleNavigateToWorkspace}>
            Go to your workspace
          </Button>
        </ErrorState>
      );
    }

    if (error.status === 403) {
      return (
        <ErrorState
          icon={<IconShieldOff />}
          title="You don't have access to this workspace"
          message="You don't have permission to view this workspace. Ask the owner or an administrator to grant you access."
          className="min-h-svh"
        >
          <Button variant="outline" onClick={handleNavigateToWorkspace}>
            Go to your workspace
          </Button>
        </ErrorState>
      );
    }

    if (error.kind === "network") {
      return (
        <ErrorState
          icon={<IconCloudOff />}
          title="Unable to connect"
          message="We couldn't load this workspace because there was a problem connecting to the server. Check your connection and try again."
          className="min-h-svh"
        >
          <Button variant="outline" onClick={() => router.invalidate()}>
            <IconRefresh />
            Retry loading
          </Button>
        </ErrorState>
      );
    }
  }

  return (
    <ErrorState
      icon={<IconAlertTriangle />}
      title="Something went wrong"
      message="We couldn't load this workspace due to an unexpected error. Please try again, and if the problem continues, contact support."
      className="min-h-svh"
    >
      <Button variant="outline" onClick={() => router.invalidate()}>
        <IconRefresh />
        Retry loading
      </Button>
    </ErrorState>
  );
}
