import { Fragment } from "react/jsx-runtime";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@bola/ui/components/empty";
import { Button } from "@bola/ui/components/button";
import { BoardCard } from "./board-card";
import { BoardCardSkeleton } from "./board-card-skeleton";
import { BoardDialog } from "./board-dialog";
import { FileIcon, SearchIcon } from "lucide-react";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useWorkspaceSlug } from "#/shared/hooks/use-workspace-slug";
import { boardQueries } from "../api/queries";

interface BoardListProps {
  q?: string;
  onClear: () => void;
}

export function BoardList({ q, onClear }: BoardListProps) {
  const workspaceSlug = useWorkspaceSlug();

  const { status, data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery(boardQueries.infinite(workspaceSlug, q));

  if (status === "pending") {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <BoardCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (status === "error") return;

  if (!data.pages[0]?.boards.length) {
    if (q) {
      return (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchIcon />
            </EmptyMedia>
            <EmptyTitle>No boards found</EmptyTitle>
            <EmptyDescription>
              We couldn't find any board you're looking for. Clear your search to see all available
              boards.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={onClear}>Clear search</Button>
          </EmptyContent>
        </Empty>
      );
    }

    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileIcon />
          </EmptyMedia>
          <EmptyTitle>No boards yet</EmptyTitle>
          <EmptyDescription>
            You don't have any boards yet. Create your first board to get started
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <BoardDialog trigger={<Button>Create board</Button>} />
        </EmptyContent>
      </Empty>
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
