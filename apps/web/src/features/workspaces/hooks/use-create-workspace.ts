import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postWorkspace } from "../api/requests";
import { workspaceQueries } from "../api/queries";
import type { CreateWorkspaceInput } from "@bola/contracts/workspaces";

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ input }: { input: CreateWorkspaceInput }) => postWorkspace(input),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceQueries.list().queryKey });
    },
  });
}
