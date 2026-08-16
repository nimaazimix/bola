import { ErrorState, type ErrorStateProps } from "#/shared/components/error-state";
import { Button } from "@bola/ui/components/button";
import { CloudOffIcon, DatabaseXIcon, TriangleAlert } from "lucide-react";
import { ApiError } from "#/shared/api/errors";
import { Link } from "@tanstack/react-router";

interface BoardErrorStateProps {
  error: unknown;
  onRetry: () => void;
}

export function BoardErrorState(props: BoardErrorStateProps) {
  return <ErrorState {...getErrorStateProps(props)} className="h-[calc(100svh-5rem)]" />;
}

function getErrorStateProps({ error, onRetry }: BoardErrorStateProps): ErrorStateProps {
  if (error instanceof ApiError) {
    if (error.status === 404) {
      return {
        icon: DatabaseXIcon,
        title: "Board not found",
        message:
          "We couldn't find the board you're trying to access. It may have been deleted or you may not have access to it.",
        children: (
          <Button asChild>
            <Link from="/$workspaceSlug" to="/$workspaceSlug/boards">
              View boards
            </Link>
          </Button>
        ),
      };
    }

    if (error.kind === "network") {
      return {
        icon: CloudOffIcon,
        title: "Unable to connect to the server",
        message:
          "We couldn't load this board because there was a problem connecting to the server. Check your connection and try again.",
        children: <Button onClick={onRetry}>Retry loading</Button>,
      };
    }
  }

  return {
    icon: TriangleAlert,
    title: "Something went wrong",
    message:
      "We couldn't load this board due to an unexpected error. Please try again, and if the problem continues, contact support.",
    children: <Button onClick={onRetry}>Retry loading</Button>,
  };
}
