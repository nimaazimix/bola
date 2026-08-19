import { BoardCard } from "./board-card";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { boardQueries } from "../api/queries";
import { Fragment } from "react/jsx-runtime";
import { Button } from "@bola/ui/components/button";

interface BoardListProps {
  workspaceSlug: string;
}

export function BoardList({ workspaceSlug }: BoardListProps) {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useSuspenseInfiniteQuery(boardQueries.infinite(workspaceSlug));

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
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
