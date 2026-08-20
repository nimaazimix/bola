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
import { AlertTriangleIcon, CloudOffIcon, DatabaseXIcon } from "lucide-react";

import { ApiError } from "#/shared/api/errors";

interface WorkspaceErrorProps {
  error: Error;
  onGoHome: () => void;
  onRetry: () => void;
}

export function WorkspaceError({ error, onRetry, onGoHome }: WorkspaceErrorProps) {
  if (error instanceof ApiError) {
    if (error.status === 404) {
      return (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <DatabaseXIcon />
            </EmptyMedia>
            <EmptyTitle>Workspace not found</EmptyTitle>
            <EmptyDescription>
              We couldn't find the workspace you're trying to access. It may have been deleted,
              moved, or you may not have access to it.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={onGoHome}>Go home</Button>
          </EmptyContent>
        </Empty>
      );
    }

    if (error.kind === "network") {
      return (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CloudOffIcon />
            </EmptyMedia>
            <EmptyTitle>Unable to connect to the server</EmptyTitle>
            <EmptyDescription>
              We couldn't load this workspace because there was a problem connecting to the server.
              Check your connection and try again.
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
            We couldn't load this workspace due to an unexpected error. Please try again, and if the
            problem continues, contact support.
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
