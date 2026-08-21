import { BoardList, boardQueries, BoardsError, CreateBoardDialog } from "#/features/boards";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@bola/ui/components/input-group";
import { Button } from "@bola/ui/components/button";
import { PlusIcon, SearchIcon } from "lucide-react";

import { createFileRoute, useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BoardsSearchSchema } from "#/app/navigation/schema";
import { workspaceQueries } from "#/features/workspaces";
import { Loader } from "@bola/ui/components/loader";

export const Route = createFileRoute("/_authenticated/_onboarded/$workspaceSlug/boards/")({
  validateSearch: BoardsSearchSchema,
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: async ({ context: { queryClient }, params, deps }) => {
    await queryClient.ensureInfiniteQueryData(boardQueries.infinite(params.workspaceSlug, deps.q));
  },
  pendingComponent: PendingComponent,
  errorComponent: ErrorComponent,
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const { workspaceSlug } = Route.useParams();

  const { data: workspace } = useSuspenseQuery(workspaceQueries.detail(workspaceSlug));

  function handleSearch(term: string) {
    const newSearch = { ...search };
    if (term) {
      newSearch.q = term;
    } else {
      newSearch.q = undefined;
    }
    navigate({ to: ".", search: newSearch });
  }

  return (
    <div className="@container flex min-h-[calc(100svh-5rem)] flex-col gap-8 p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{workspace.name}'s boards</h1>
          <CreateBoardDialog
            workspaceSlug={workspaceSlug}
            onCreateBoard={(boardId) =>
              navigate({ to: "/$workspaceSlug/boards/$boardId", params: { boardId } })
            }
          >
            <Button className="@max-sm:hidden">
              <PlusIcon />
              Create board
            </Button>
          </CreateBoardDialog>
        </div>
        <p className="text-muted-foreground text-sm">
          Discover and search all the boards available in this workspace
        </p>

        <CreateBoardDialog
          workspaceSlug={workspaceSlug}
          onCreateBoard={(boardId) =>
            navigate({ to: "/$workspaceSlug/boards/$boardId", params: { boardId } })
          }
        >
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
        <BoardList workspaceSlug={workspaceSlug} q={search.q} />
      </div>
    </div>
  );
}

function ErrorComponent({ error }: ErrorComponentProps) {
  const router = useRouter();

  return (
    <div className="centered h-[calc(100svh-5rem)]">
      <BoardsError error={error} onRetry={router.invalidate} />
    </div>
  );
}

function PendingComponent() {
  return (
    <div className="centered h-[calc(100svh-5rem)]">
      <Loader />
    </div>
  );
}
