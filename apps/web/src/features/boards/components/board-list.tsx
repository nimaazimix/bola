import { BoardCard } from "./board-card";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { boardQueries } from "../api/queries";
import { Fragment } from "react/jsx-runtime";
import { Button } from "@bola/ui/components/button";
import { BoardListEmpty } from "./board-list-empty";

interface BoardListProps {
  workspaceSlug: string;
  q?: string;
}

export function BoardList({ q, workspaceSlug }: BoardListProps) {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useSuspenseInfiniteQuery(boardQueries.infinite(workspaceSlug, q));

  if (!data.pages[0]?.data.length) {
    return <BoardListEmpty />;
  }

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {data.pages.map((group, i) => (
          <Fragment key={i}>
            {group.data.map((board) => (
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
