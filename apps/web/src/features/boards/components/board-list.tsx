import { Button } from "@bola/ui/components/button";
import { BoardCard } from "./board-card";
import { BoardCardSkeleton } from "./board-card-skeleton";
import { BoardListError } from "./board-list-error";
import { BoardListEmpty } from "./board-list-empty";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useWorkspaceSlug } from "#/shared/hooks/use-workspace-slug";
import { boardQueries } from "../api/queries";

interface BoardListProps {
  q?: string;
  onClear: () => void;
}

export function BoardList({ q, onClear }: BoardListProps) {
  const workspaceSlug = useWorkspaceSlug();

  const {
    status,
    isFetching,
    error,
    data,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
  } = useInfiniteQuery(boardQueries.infinite(workspaceSlug, q));

  if (status === "pending") {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <BoardCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return <BoardListError error={error} onRetry={refetch} />;
  }

  const boards = data.pages.flatMap((page) => page.boards);

  if (!boards.length) {
    return <BoardListEmpty type={q ? "no-result" : "no-boards"} onClear={onClear} />;
  }

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {boards.map((board) => (
          <BoardCard key={board.id} board={board} />
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
