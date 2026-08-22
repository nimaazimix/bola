import { InputGroup, InputGroupAddon, InputGroupInput } from "@bola/ui/components/input-group";
import { Button } from "@bola/ui/components/button";
import { BoardList, CreateBoardDialog } from "#/features/boards";
import { PlusIcon, SearchIcon } from "lucide-react";

import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { workspaceQueries } from "#/features/workspaces";
import { BoardsSearchSchema } from "#/app/navigation/schema";

export const Route = createFileRoute("/_authenticated/_onboarded/$workspaceSlug/boards/")({
  validateSearch: BoardsSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { workspaceSlug } = Route.useParams();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const { data: workspace } = useSuspenseQuery(workspaceQueries.detail(workspaceSlug));

  function handleCreateBoard(boardId: string) {
    navigate({ to: "/$workspaceSlug/boards/$boardId", params: { boardId } });
  }

  function handleSearch(term: string) {
    const newSearch = { ...search };

    if (term) {
      newSearch.q = term;
    } else {
      newSearch.q = undefined;
    }

    navigate({ to: ".", search: newSearch });
  }

  function handleClear() {
    navigate({ to: ".", search: { q: undefined } });
  }

  return (
    <div className="@container flex min-h-full flex-col gap-5 p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{workspace.name}'s boards</h1>
          <CreateBoardDialog onCreateBoard={handleCreateBoard}>
            <Button className="@max-sm:hidden">
              <PlusIcon />
              Create board
            </Button>
          </CreateBoardDialog>
        </div>
        <p className="text-muted-foreground text-sm">
          Discover and search all the boards available in this workspace
        </p>

        <CreateBoardDialog onCreateBoard={handleCreateBoard}>
          <Button className="@sm:hidden">
            <PlusIcon />
            Create board
          </Button>
        </CreateBoardDialog>
      </div>

      <div className="flex flex-1 flex-col space-y-4">
        <InputGroup className="max-w-md">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            defaultValue={search.q}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by board name"
          />
        </InputGroup>
        <BoardList q={search.q} onClear={handleClear} />
      </div>
    </div>
  );
}
