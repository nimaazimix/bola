import { BoardCard } from "./board-card";

import { useSuspenseQuery } from "@tanstack/react-query";
import { boardQueries } from "../api/queries";

interface BoardListProps {
  workspaceSlug: string;
}

export function BoardList({ workspaceSlug }: BoardListProps) {
  const { data: boards } = useSuspenseQuery(boardQueries.list(workspaceSlug));

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      {boards.map((board) => (
        <BoardCard key={board.id} board={board} />
      ))}
    </div>
  );
}
