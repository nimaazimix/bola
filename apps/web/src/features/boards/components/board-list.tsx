import { BoardCard } from "./board-card";

import { useInfiniteQuery } from "@tanstack/react-query";
import { boardQueries } from "../api/queries";
import { Fragment } from "react/jsx-runtime";
import { Button } from "@bola/ui/components/button";
import { useNavigate, useParams } from "@tanstack/react-router";
import { CreateBoardDialog } from "./create-board-dialog";
import { FileIcon, SearchIcon } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@bola/ui/components/empty";

interface BoardListProps {
  q?: string;
  onClear: () => void;
}

export function BoardList({ q, onClear }: BoardListProps) {
  const { workspaceSlug } = useParams({ from: "/_authenticated/_onboarded/$workspaceSlug" });
  const navigate = useNavigate({ from: "/$workspaceSlug" });

  const { status, data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery(boardQueries.infinite(workspaceSlug, q));

  if (status === "pending") return;
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
          <CreateBoardDialog
            onCreateBoard={(boardId) =>
              navigate({ to: "/$workspaceSlug/boards/$boardId", params: { boardId } })
            }
          >
            <Button>Create board</Button>
          </CreateBoardDialog>
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
