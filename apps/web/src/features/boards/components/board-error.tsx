import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@bola/ui/components/empty";
import { Button } from "@bola/ui/components/button";
import { ErrorComponent, Link } from "@tanstack/react-router";
import { AlertTriangleIcon, CloudOffIcon, FileIcon } from "lucide-react";

import { ApiError } from "#/shared/api/errors";

const data = {
  notFound: {
    icon: FileIcon,
    title: "Board not found",
    description:
      "We couldn't find the board you're trying to access. It may have been deleted or you may not have access to it.",
    actions: ["view-boards"],
  },
  network: {
    icon: CloudOffIcon,
    title: "Unable to connect to the server",
    description:
      "We couldn't load this board because there was a problem connecting to the server. Check your connection and try again.",
    actions: ["retry"],
  },
  unknown: {
    icon: AlertTriangleIcon,
    title: "Something went wrong",
    description:
      "We couldn't load this board due to an unexpected error. Please try again, and if the problem continues, contact support.",
    actions: ["retry"],
  },
};

interface BoardErrorProps {
  error: Error;
  onRetry: () => void;
}

export function BoardError({ error, onRetry }: BoardErrorProps) {
  if (!(error instanceof ApiError)) {
    return <ErrorComponent error={error} />;
  }

  let state = data.unknown;

  if (error.status === 404) {
    state = data.notFound;
  } else if (error.kind === "network") {
    state = data.network;
  }

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <state.icon />
        </EmptyMedia>
        <EmptyTitle>{state.title}</EmptyTitle>
        <EmptyDescription>{state.description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {state.actions.map((action) =>
          action === "view-boards" ? (
            <Button asChild>
              <Link from="/$workspaceSlug" to="/$workspaceSlug/boards">
                View boards
              </Link>
            </Button>
          ) : (
            <Button onClick={onRetry}>Retry loading</Button>
          ),
        )}
      </EmptyContent>
    </Empty>
  );
}
