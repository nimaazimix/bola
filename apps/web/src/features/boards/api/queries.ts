import { queryOptions } from "@tanstack/react-query";
import { getBoard, getBoards } from "./requests";

export const boardQueries = {
  all: ["boards"],

  lists: () => [...boardQueries.all, "list"],
  list: (workspacesSlug: string) =>
    queryOptions({
      queryKey: [...boardQueries.lists(), workspacesSlug],
      queryFn: () => getBoards(workspacesSlug),
    }),

  details: () => [...boardQueries.all, "detail"],
  detail: (workspaceSlug: string, boardId: string) =>
    queryOptions({
      queryKey: [boardQueries.details(), workspaceSlug, boardId],
      queryFn: () => getBoard(workspaceSlug, boardId),
    }),
};
