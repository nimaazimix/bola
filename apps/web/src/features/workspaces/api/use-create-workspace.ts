import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateWorkspaceInput } from "@bola/contracts/workspaces";
import { postWorkspace } from "./requests";
import { workspaceQueries } from "./workspace-queries";

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ input }: { input: CreateWorkspaceInput }) => postWorkspace(input),

    onSuccess: (workspace) => {
      queryClient.setQueryData(workspaceQueries.list().queryKey, (oldData) => {
        if (!oldData) return [workspace];
        return [workspace, ...oldData];
      });
    },
  });
}
