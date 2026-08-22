import { BoardCard } from "./board-card";

import { useInfiniteQuery } from "@tanstack/react-query";
import { boardQueries } from "../api/queries";
import { Fragment } from "react/jsx-runtime";
import { Button } from "@bola/ui/components/button";
import { BoardsEmpty } from "./boards-empty";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { CreateBoardDialog } from "./create-board-dialog";

interface BoardListProps {
  q?: string;
}

export function BoardList({ q }: BoardListProps) {
  const { workspaceSlug } = useParams({ from: "/_authenticated/_onboarded/$workspaceSlug" });
  const navigate = useNavigate({ from: "/$workspaceSlug/boards" });

  const { status, data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery(boardQueries.infinite(workspaceSlug, q));

  if (status === "pending") return;
  if (status === "error") return;

  if (!data.pages[0]?.boards.length) {
    if (q) {
      return (
        <BoardsEmpty
          title="No boards found"
          description="We couldn't find any board you're looking for. Clear your search to see all available boards."
        >
          <Button asChild>
            <Link from="/$workspaceSlug/boards" to="." search={{ q: undefined }}>
              Clear search
            </Link>
          </Button>
        </BoardsEmpty>
      );
    }
    return (
      <BoardsEmpty>
        <CreateBoardDialog
          onCreateBoard={(boardId) =>
            navigate({ to: "/$workspaceSlug/boards/$boardId", params: { boardId } })
          }
        >
          <Button>Create board</Button>
        </CreateBoardDialog>
      </BoardsEmpty>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {data.pages.map((group, i) => (
          <Fragment key={i}>
            {group.boards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </Fragment>
        ))}
      </div>
      {hasNextPage && (
        <Button
          size="sm"
          variant="ghost"
          className="mx-auto"
          onClick={() => fetchNextPage()}
          disabled={isFetching}
        >
          {isFetchingNextPage ? "Loading more..." : "Load More"}
        </Button>
      )}
    </div>
  );
}
