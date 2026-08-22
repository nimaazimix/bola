import { Link } from "@tanstack/react-router";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@bola/ui/components/sidebar";
import { FolderIcon, MoreHorizontalIcon, PlusIcon } from "lucide-react";

import { useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { boardQueries, CreateBoardDialog } from "#/features/boards";

export interface NavBoardsProps {
  workspaceSlug: string;
}

export function NavBoards({ workspaceSlug }: NavBoardsProps) {
  const navigate = useNavigate({ from: "/$workspaceSlug" });
  const { data: boards } = useSuspenseQuery(boardQueries.recent(workspaceSlug));

  function handleCreateBoard(boardId: string) {
    navigate({ to: "/$workspaceSlug/boards/$boardId", params: { boardId } });
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Boards</SidebarGroupLabel>

      <SidebarGroupAction>
        <CreateBoardDialog onCreateBoard={handleCreateBoard}>
          <PlusIcon className="text-muted-foreground" />
        </CreateBoardDialog>
      </SidebarGroupAction>

      <SidebarGroupContent>
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
                  <FolderIcon />
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
                activeProps={{
                  className: "bg-sidebar-accent text-sidebar-accent-foreground border",
                }}
                activeOptions={{ exact: true }}
              >
                <MoreHorizontalIcon />
                <span>More</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
