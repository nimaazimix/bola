import { BoardList, boardQueries, CreateBoardDialog } from "#/features/boards";
import { Search } from "#/shared/components/search";
import { Button } from "@bola/ui/components/button";
import { PlusIcon } from "lucide-react";

import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { workspaceQueries } from "#/features/workspaces";

export const Route = createFileRoute("/_authenticated/_onboarded/$workspaceSlug/boards/")({
  loader: async ({ context: { queryClient }, params }) => {
    await queryClient.ensureInfiniteQueryData(boardQueries.infinite(params.workspaceSlug));
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { workspaceSlug } = Route.useParams();
  const { data: workspace } = useSuspenseQuery(workspaceQueries.detail(workspaceSlug));

  return (
    <div className="space-y-8 p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{workspace.name}'s boards</h1>
          <CreateBoardDialog
            workspaceSlug={workspaceSlug}
            onCreateBoard={(boardId) =>
              navigate({ to: "/$workspaceSlug/boards/$boardId", params: { boardId } })
            }
          >
            <Button>
              <PlusIcon />
              Create board
            </Button>
          </CreateBoardDialog>
        </div>
        <p className="text-muted-foreground text-sm">
          Discover and search all the boards available in this workspace
        </p>
      </div>

      <div className="space-y-4">
        <Search placeholder="Search by board name" />
        <BoardList workspaceSlug={workspaceSlug} />
      </div>
    </div>
  );
}
