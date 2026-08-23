import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@bola/ui/components/empty";
import { Button } from "@bola/ui/components/button";
import { AlertTriangleIcon, CloudOffIcon, DatabaseXIcon } from "lucide-react";

import { ApiError } from "#/shared/api/errors";

const data = {
  notFound: {
    icon: DatabaseXIcon,
    title: "Workspace not found",
    description:
      "We couldn't find the workspace you're trying to access. It may have been deleted, moved, or you may not have access to it.",
    actions: ["go-home"],
  },
  network: {
    icon: CloudOffIcon,
    title: "Unable to connect to the server",
    description:
      "We couldn't load this workspace because there was a problem connecting to the server. Check your connection and try again.",
    actions: ["retry"],
  },
  unknown: {
    icon: AlertTriangleIcon,
    title: "Something went wrong",
    description:
      "We couldn't load this workspace due to an unexpected error. Please try again, and if the problem continues, contact support.",
    actions: ["retry"],
  },
};

interface WorkspaceErrorProps {
  error: ApiError;
  onGoHome: () => void;
  onRetry: () => void;
}

export function WorkspaceError({ error, onGoHome, onRetry }: WorkspaceErrorProps) {
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
          action === "go-home" ? (
            <Button onClick={onGoHome}>Go home</Button>
          ) : (
            <Button onClick={onRetry}>Retry loading</Button>
          ),
        )}
      </EmptyContent>
    </Empty>
  );
}
