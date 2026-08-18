import { queryOptions } from "@tanstack/react-query";
import { getBoard, getBoards } from "./requests";
import type { BoardListQueryIn } from "@bola/contracts/boards";

export const boardQueries = {
  all: ["boards"],

  lists: () => [...boardQueries.all, "list"],
  list: (workspacesSlug: string, query?: BoardListQueryIn) =>
    queryOptions({
      queryKey: [...boardQueries.lists(), workspacesSlug, query],
      queryFn: () => getBoards(workspacesSlug, query),
    }),

  details: () => [...boardQueries.all, "detail"],
  detail: (workspaceSlug: string, boardId: string) =>
    queryOptions({
      queryKey: [boardQueries.details(), workspaceSlug, boardId],
      queryFn: () => getBoard(workspaceSlug, boardId),
    }),
};
