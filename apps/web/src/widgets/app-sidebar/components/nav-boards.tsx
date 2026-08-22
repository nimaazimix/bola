import { Link, useLocation, useParams } from "@tanstack/react-router";
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

import { useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { boardQueries, CreateBoardDialog } from "#/features/boards";
import { cn } from "@bola/ui/lib/utils";

export function NavBoards() {
  const { workspaceSlug } = useParams({ from: "/_authenticated/_onboarded/$workspaceSlug" });
  const location = useLocation();
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
