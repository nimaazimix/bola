import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@bola/ui/components/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@bola/ui/components/dropdown-menu";
import { IconCheck, IconPlus, IconSelector } from "@tabler/icons-react";
import { Avatar, AvatarFallback } from "@bola/ui/components/avatar";

import { Link, useParams } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { workspaceQueries } from "#/features/workspaces";
import { getInitial } from "#/shared/lib";

export function WorkspaceSwitcher() {
  const { isMobile } = useSidebar();
  const { workspaceSlug } = useParams({ from: "/_authenticated/$workspaceSlug" });

  const { data: workspaces } = useSuspenseQuery(workspaceQueries.list());
  const activeWorkspace = workspaces.find((workspace) => workspace.slug === workspaceSlug);

  if (!activeWorkspace) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar>
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground rounded-lg">
                  {getInitial(activeWorkspace.name)}
                </AvatarFallback>
              </Avatar>

              <div className="grid leading-tight">
                <span className="truncate font-medium">{activeWorkspace.name}</span>
                <span className="truncate text-xs">Owner</span>
              </div>
              <IconSelector className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            sideOffset={6}
            align="start"
            className="min-w-56"
          >
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>

            {workspaces.map((workspace) => (
              <DropdownMenuItem key={workspace.name} className="gap-2 p-2" asChild>
                <Link
                  to="/$workspaceSlug"
                  params={{ workspaceSlug: workspace.slug }}
                  className="focus-visible:ring-0"
                  children={({ isActive }) => (
                    <>
                      <Avatar size="sm" className="after:rounded-md">
                        <AvatarFallback className="text-muted-foreground! rounded-md">
                          {getInitial(workspace.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{workspace.name}</span>
                      {isActive && <IconCheck className="ml-auto" />}
                    </>
                  )}
                />
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <IconPlus />
              <span>Add workspace</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
