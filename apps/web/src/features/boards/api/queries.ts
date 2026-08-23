import { infiniteQueryOptions, keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getBoard, getBoards } from "./requests";

export const boardQueries = {
  all: (workspaceSlug: string) => ["boards", workspaceSlug],

  lists: (workspaceSlug: string) => [...boardQueries.all(workspaceSlug), "list"],

  recent: (workspaceSlug: string) =>
    queryOptions({
      queryKey: [...boardQueries.lists(workspaceSlug), "recent"],
      queryFn: () => getBoards(workspaceSlug, { limit: 5 }).then((page) => page.boards),
    }),

  infinite: (workspaceSlug: string, q?: string, limit?: number) =>
    infiniteQueryOptions({
      queryKey: [...boardQueries.lists(workspaceSlug), "infinite", { q, limit }],
      queryFn: ({ pageParam }) => getBoards(workspaceSlug, { q, limit, cursor: pageParam }),
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      placeholderData: keepPreviousData,
    }),

  details: (workspaceSlug: string) => [...boardQueries.all(workspaceSlug), "detail"],

  detail: (workspaceSlug: string, boardId: string) =>
    queryOptions({
      queryKey: [boardQueries.details(workspaceSlug), boardId],
      queryFn: () => getBoard(workspaceSlug, boardId),
    }),
};
