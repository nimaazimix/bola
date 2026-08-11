import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postWorkspace } from "../api/requests";
import { workspaceQueries } from "../api/queries";
import type { CreateWorkspaceInput } from "@bola/contracts/workspaces";

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ input }: { input: CreateWorkspaceInput }) => postWorkspace(input),

    onSuccess: (workspace) => {
      queryClient.setQueryData(workspaceQueries.list().queryKey, (oldData) => {
        if (!oldData) {
          return [workspace];
        }
        return [...oldData, workspace].sort((ws1, ws2) => ws1.name.localeCompare(ws2.name));
      });
    },
  });
}
