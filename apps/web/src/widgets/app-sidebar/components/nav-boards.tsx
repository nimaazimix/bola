import { Link } from "@tanstack/react-router";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@bola/ui/components/sidebar";

import { useSuspenseQuery } from "@tanstack/react-query";
import { boardQueries } from "#/features/boards";

export interface NavBoardsProps {
  workspaceSlug: string;
}

export function NavBoards({ workspaceSlug }: NavBoardsProps) {
  const { data: boards } = useSuspenseQuery(boardQueries.list(workspaceSlug));

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Boards</SidebarGroupLabel>
      <SidebarMenu>
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
                <span>{board.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
