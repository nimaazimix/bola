import { BoardViewport } from "#/widgets/board-viewport";

import { createFileRoute } from "@tanstack/react-router";
import { boardQueries } from "#/features/boards";
import type { Board } from "@bola/contracts/boards";

export const Route = createFileRoute("/_authenticated/_onboarded/$workspaceSlug/boards/$boardId")({
  loader: async ({ context: { queryClient }, params }) => {
    return await queryClient.ensureQueryData(
      boardQueries.detail(params.workspaceSlug, params.boardId),
    );
  },
  staticData: {
    title: (loaderData) => (loaderData as Board)?.name || "Error",
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-[calc(100dvh-5rem)]">
      <BoardViewport />;
    </div>
  );
}
