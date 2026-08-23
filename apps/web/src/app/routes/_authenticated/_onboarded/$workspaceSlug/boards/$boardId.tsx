import { BoardViewport } from "#/widgets/board-viewport";

import {
  createFileRoute,
  ErrorComponent as DefaultErrorComponent,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { BoardError, boardQueries } from "#/features/boards";
import { ApiError } from "#/shared/api/errors";
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
  errorComponent: ErrorComponent,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-[calc(100dvh-5rem)]">
      <BoardViewport />;
    </div>
  );
}

function ErrorComponent({ error }: ErrorComponentProps) {
  const router = useRouter();

  if (error instanceof ApiError) {
    return (
      <div className="centered h-[calc(100dvh-5rem)]">
        <BoardError error={error} onRetry={router.invalidate} />
      </div>
    );
  }

  return <DefaultErrorComponent error={error} />;
}
