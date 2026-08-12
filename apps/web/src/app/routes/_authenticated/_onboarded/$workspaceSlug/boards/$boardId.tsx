import { boardQueries } from "#/features/boards";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_onboarded/$workspaceSlug/boards/$boardId")({
  staticData: {
    title: "Board",
  },
  loader: async ({ context: { queryClient }, params }) => {
    return queryClient.ensureQueryData(boardQueries.detail(params.workspaceSlug, params.boardId));
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div></div>;
}
