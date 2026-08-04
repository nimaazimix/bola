import { SidebarProvider, SidebarTrigger } from "@bola/ui/components/sidebar";
import { AppSidebar } from "#/widgets/app-sidebar";

import { createFileRoute, Outlet } from "@tanstack/react-router";
import { workspaceQueries } from "#/features/workspaces";

export const Route = createFileRoute("/_authenticated/_onboarded/$workspaceSlug")({
  loader: async ({ context: { queryClient }, params }) => {
    await Promise.all([
      queryClient.ensureQueryData(workspaceQueries.detail(params.workspaceSlug)),
      queryClient.ensureQueryData(workspaceQueries.list()),
    ]);
  },
  component: RouteComponent,
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
