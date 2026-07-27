import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, workspaceQueries } from "#/shared/api";
import type { ApiSuccess } from "@bola/contracts/api";
import type { CreateWorkspaceInput, Workspace } from "@bola/contracts/workspaces";

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ input }: { input: CreateWorkspaceInput }) =>
      api.post<ApiSuccess<Workspace>>("/workspaces", input).then((res) => res.data.data),

    onSuccess: (workspace) => {
      queryClient.setQueryData(workspaceQueries.list().queryKey, (oldData) => {
        if (!oldData) return [workspace];
        return [workspace, ...oldData];
      });
    },
  });
}
