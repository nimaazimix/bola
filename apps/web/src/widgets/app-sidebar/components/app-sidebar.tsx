import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@bola/ui/components/sidebar";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { NavMain } from "./nav-main";
import { NavBoards } from "./nav-boards";
import { NavUser } from "./nav-user";

import { useParams } from "@tanstack/react-router";

export function AppSidebar() {
  const { workspaceSlug } = useParams({ from: "/_authenticated/_onboarded/$workspaceSlug" });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <WorkspaceSwitcher workspaceSlug={workspaceSlug} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain />
        <NavBoards workspaceSlug={workspaceSlug} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
