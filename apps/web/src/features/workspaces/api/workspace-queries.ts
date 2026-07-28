import { queryOptions } from "@tanstack/react-query";
import { getWorkspaces } from "./requests";

export const workspaceQueries = {
  all: ["workspaces"],
  lists: () => [...workspaceQueries.all, "list"],
  list: () =>
    queryOptions({
      queryKey: [...workspaceQueries.lists()],
      queryFn: () => getWorkspaces(),
    }),
};
