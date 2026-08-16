import { BoardViewport } from "#/widgets/board-viewport";
import { BoardErrorState, boardQueries } from "#/features/boards";

import { createFileRoute, useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import type { Board } from "@bola/contracts/boards";

export const Route = createFileRoute("/_authenticated/_onboarded/$workspaceSlug/boards/$boardId")({
  loader: async ({ context: { queryClient }, params }) => {
    return queryClient.ensureQueryData(boardQueries.detail(params.workspaceSlug, params.boardId));
  },
  staticData: {
    title: (loaderData) => (loaderData as Board)?.name || "Error",
  },
  component: RouteComponent,
  errorComponent: ErrorComponent,
});

function RouteComponent() {
  return (
    <div className="h-[calc(100svh-5rem)]">
      <BoardViewport />;
    </div>
  );
}

function ErrorComponent({ error }: ErrorComponentProps) {
  const router = useRouter();

  return <BoardErrorState error={error} onRetry={() => router.invalidate()} />;
}
