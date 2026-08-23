import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@bola/ui/components/empty";
import { Button } from "@bola/ui/components/button";
import { ErrorComponent } from "@tanstack/react-router";
import { AlertTriangleIcon, CloudOffIcon } from "lucide-react";

import { ApiError } from "#/shared/api/errors";

const data = {
  network: {
    icon: CloudOffIcon,
    title: "Unable to connect to the server",
    description:
      "We couldn't load boards because there was a problem connecting to the server. Check your connection and try again.",
  },
  unknown: {
    icon: AlertTriangleIcon,
    title: "Something went wrong",
    description:
      "We couldn't load boards due to an unexpected error. Please try again, and if the problem continues, contact support.",
  },
};

interface BoardListErrorProps {
  error: Error;
  onRetry: () => void;
}

export function BoardListError({ error, onRetry }: BoardListErrorProps) {
  if (!(error instanceof ApiError)) {
    return <ErrorComponent error={error} />;
  }

  let state = data.unknown;

  if (error.kind === "network") {
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
        <Button onClick={onRetry}>Retry loading</Button>
      </EmptyContent>
    </Empty>
  );
}
