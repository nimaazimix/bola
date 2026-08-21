import { Link } from "@tanstack/react-router";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@bola/ui/components/sidebar";
import { FolderIcon, MoreHorizontalIcon, PlusIcon } from "lucide-react";

import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { boardQueries, BoardsEmpty, BoardsError, CreateBoardDialog } from "#/features/boards";
import { Button } from "@bola/ui/components/button";

export interface NavBoardsProps {
  workspaceSlug: string;
}

export function NavBoards({ workspaceSlug }: NavBoardsProps) {
  const navigate = useNavigate({ from: "/$workspaceSlug" });
  const { status, error, refetch, data: boards } = useQuery(boardQueries.recent(workspaceSlug, 5));

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Boards</SidebarGroupLabel>

      <SidebarGroupAction>
        <CreateBoardDialog
          workspaceSlug={workspaceSlug}
          onCreateBoard={(boardId) =>
            navigate({ to: "/$workspaceSlug/boards/$boardId", params: { boardId } })
          }
        >
          <PlusIcon className="text-muted-foreground" />
        </CreateBoardDialog>
      </SidebarGroupAction>

      <SidebarGroupContent>
        {status === "pending" ? (
          <SidebarMenu>
            {Array.from({ length: 5 }).map((_, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuSkeleton />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        ) : status === "error" ? (
          <BoardsError error={error} onRetry={refetch} />
        ) : boards.length === 0 ? (
          <BoardsEmpty>
            <CreateBoardDialog
              workspaceSlug={workspaceSlug}
              onCreateBoard={(boardId) =>
                navigate({ to: "/$workspaceSlug/boards/$boardId", params: { boardId } })
              }
            >
              <Button size="sm" variant="outline">
                Create board
              </Button>
            </CreateBoardDialog>
          </BoardsEmpty>
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
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
