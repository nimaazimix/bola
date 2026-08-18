import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postBoard } from "../api/requests";
import { boardQueries } from "../api/queries";
import type { CreateBoardInput } from "@bola/contracts/boards";

export function useCreateBoard(workspaceSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ input }: { input: CreateBoardInput }) => postBoard(workspaceSlug, input),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardQueries.list(workspaceSlug).queryKey });
    },
  });
}
