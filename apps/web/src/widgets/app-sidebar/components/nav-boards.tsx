import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@bola/ui/components/sidebar";
import { FileIcon, MoreHorizontalIcon, PlusIcon } from "lucide-react";

import { Link, useLocation } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useWorkspaceSlug } from "#/shared/hooks/use-workspace-slug";
import { BoardDialog, boardQueries } from "#/features/boards";
import { cn } from "@bola/ui/lib/utils";

export function NavBoards() {
  const workspaceSlug = useWorkspaceSlug();
  const { data: boards } = useSuspenseQuery(boardQueries.recent(workspaceSlug));

  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Boards</SidebarGroupLabel>

      <SidebarGroupAction>
        <BoardDialog trigger={<PlusIcon className="text-muted-foreground" />} />
      </SidebarGroupAction>

      <SidebarGroupContent>
        {boards.length === 0 ? (
          <p className="p-2 text-xs">You don't have any boards yet.</p>
        ) : (
          <SidebarMenu className="gap-0.5">
            {boards.map((board) => (
              <SidebarMenuItem key={board.name}>
                <SidebarMenuButton asChild>
                  <Link
                    from="/$workspaceSlug"
                    to="/$workspaceSlug/boards/$boardId"
                    params={{ boardId: board.id }}
                    activeProps={{
                      className: "bg-sidebar-accent text-sidebar-accent-foreground border",
                    }}
                  >
                    <FileIcon />
                    <span>{board.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  from="/$workspaceSlug"
                  to="/$workspaceSlug/boards"
                  className={cn(
                    location.pathname.endsWith("/boards") &&
                      "bg-sidebar-accent text-sidebar-accent-foreground border",
                  )}
                >
                  <MoreHorizontalIcon />
                  <span>View all</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
