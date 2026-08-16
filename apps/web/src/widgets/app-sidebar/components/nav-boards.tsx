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
import { PlusIcon } from "lucide-react";

import { useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { boardQueries, CreateBoardDialog } from "#/features/boards";

export interface NavBoardsProps {
  workspaceSlug: string;
}

export function NavBoards({ workspaceSlug }: NavBoardsProps) {
  const navigate = useNavigate({ from: "/$workspaceSlug" });
  const { data: boards } = useSuspenseQuery(boardQueries.list(workspaceSlug));

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recent</SidebarGroupLabel>

      <SidebarGroupAction>
        <CreateBoardDialog
          trigger={<PlusIcon className="text-muted-foreground" />}
          workspaceSlug={workspaceSlug}
          onCreateBoard={(boardId) =>
            navigate({ to: "/$workspaceSlug/boards/$boardId", params: { boardId } })
          }
        />
      </SidebarGroupAction>

      <SidebarGroupContent>
        <SidebarMenu className="gap-0.5">
          {boards.slice(0, 5).map((board) => (
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
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
