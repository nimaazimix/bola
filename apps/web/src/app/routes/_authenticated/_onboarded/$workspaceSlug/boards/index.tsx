import { InputGroup, InputGroupAddon, InputGroupInput } from "@bola/ui/components/input-group";
import { Button } from "@bola/ui/components/button";
import { BoardDialog, BoardList } from "#/features/boards";
import { PlusIcon, SearchIcon } from "lucide-react";

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { workspaceQueries } from "#/features/workspaces";
import { BoardsSearchSchema } from "#/app/navigation/schema";

export const Route = createFileRoute("/_authenticated/_onboarded/$workspaceSlug/boards/")({
  validateSearch: BoardsSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { workspaceSlug } = Route.useParams();
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();

  const { data: workspace } = useSuspenseQuery(workspaceQueries.detail(workspaceSlug));
  const [searchTerm, setSearchTerm] = useState(q ?? "");

  const handleSearch = useDebouncedCallback((term: string) => {
    navigate({ to: ".", search: (prev) => ({ ...prev, q: term || undefined }) });
  }, 300);

  function handleClear() {
    handleSearch.cancel();
    setSearchTerm("");
    navigate({ to: ".", search: (prev) => ({ ...prev, q: undefined }) });
  }

  return (
    <div className="@container flex min-h-full flex-col gap-5 p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{workspace.name}'s boards</h1>
          <BoardDialog
            trigger={
              <Button className="@max-sm:hidden">
                <PlusIcon />
                Create board
              </Button>
            }
          />
        </div>
        <p className="text-muted-foreground text-sm">
          Discover and search all the boards available in this workspace
        </p>

        <BoardDialog
          trigger={
            <Button className="@sm:hidden">
              <PlusIcon />
              Create board
            </Button>
          }
        />
      </div>

      <div className="flex flex-1 flex-col space-y-4">
        <InputGroup className="max-w-md">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch(e.target.value);
            }}
            placeholder="Search by board name"
          />
        </InputGroup>
        <BoardList q={q} onClear={handleClear} />
      </div>
    </div>
  );
}
