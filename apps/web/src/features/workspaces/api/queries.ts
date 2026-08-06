import { queryOptions } from "@tanstack/react-query";
import { getWorkspaceBySlug, getWorkspaces } from "./requests";

export const workspaceQueries = {
  all: ["workspaces"],

  lists: () => [...workspaceQueries.all, "list"],
  list: () =>
    queryOptions({
      queryKey: [...workspaceQueries.lists()],
      queryFn: () => getWorkspaces(),
    }),

  details: () => [...workspaceQueries.all, "detail"],
  detail: (slug: string) =>
    queryOptions({
      queryKey: [workspaceQueries.details(), slug],
      queryFn: () => getWorkspaceBySlug(slug),
    }),
};
