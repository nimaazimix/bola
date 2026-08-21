import { ErrorComponent } from "@tanstack/react-router";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@bola/ui/components/empty";
import { Button } from "@bola/ui/components/button";
import { AlertTriangleIcon, CloudOffIcon } from "lucide-react";

import { ApiError } from "#/shared/api/errors";

interface BoardsErrorProps {
  error: Error;
  onRetry: () => void;
}

export function BoardsError({ error, onRetry }: BoardsErrorProps) {
  if (error instanceof ApiError) {
    if (error.kind === "network") {
      return (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CloudOffIcon />
            </EmptyMedia>
            <EmptyTitle>Unable to connect to the server</EmptyTitle>
            <EmptyDescription>
              We couldn't load boards because there was a problem connecting to the server. Check
              your connection and try again.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={onRetry}>Retry loading</Button>
          </EmptyContent>
        </Empty>
      );
    }

    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertTriangleIcon />
          </EmptyMedia>
          <EmptyTitle>Something went wrong</EmptyTitle>
          <EmptyDescription>
            We couldn't load boards due to an unexpected error. Please try again, and if the problem
            continues, contact support.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={onRetry}>Retry loading</Button>
        </EmptyContent>
      </Empty>
    );
  }

  return <ErrorComponent error={error} />;
}
