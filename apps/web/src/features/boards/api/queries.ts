import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { getBoard, getBoards } from "./requests";

export const boardQueries = {
  all: (workspaceSlug: string) => ["boards", workspaceSlug],

  lists: (workspaceSlug: string) => [...boardQueries.all(workspaceSlug), "list"],

  recent: (workspaceSlug: string, limit?: number) =>
    queryOptions({
      queryKey: [...boardQueries.lists(workspaceSlug), { limit }],
      queryFn: () => getBoards(workspaceSlug, { limit }).then((page) => page.data),
    }),

  infinite: (workspaceSlug: string, limit?: number) =>
    infiniteQueryOptions({
      queryKey: [...boardQueries.lists(workspaceSlug), "infinite", { limit }],
      queryFn: ({ pageParam }) => getBoards(workspaceSlug, { limit, cursor: pageParam }),
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }),

  details: (workspaceSlug: string) => [...boardQueries.all(workspaceSlug), "detail"],

  detail: (workspaceSlug: string, boardId: string) =>
    queryOptions({
      queryKey: [boardQueries.details(workspaceSlug), boardId],
      queryFn: () => getBoard(workspaceSlug, boardId),
    }),
};
