import { queryOptions } from "@tanstack/react-query";
import { api } from "../client";
import type { ApiSuccess } from "@bola/contracts/api";
import type { Workspace } from "@bola/contracts/workspaces";

export const workspaceQueries = {
  all: ["workspaces"],
  lists: () => [...workspaceQueries.all, "list"],
  list: () =>
    queryOptions({
      queryKey: [...workspaceQueries.lists()],
      queryFn: () => getWorkspaces(),
    }),
};

async function getWorkspaces() {
  return api.get<ApiSuccess<Workspace[]>>("/workspaces").then((res) => res.data.data);
}
