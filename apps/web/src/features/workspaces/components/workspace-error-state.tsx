import { ApiError } from "#/shared/api/errors";
import { ErrorState, type ErrorStateProps } from "#/shared/components/error-state";
import { Button } from "@bola/ui/components/button";
import { CloudOffIcon, DatabaseXIcon, TriangleAlert } from "lucide-react";

interface WorkspaceErrorStateProps {
  error: unknown;
  onNavigate: () => void;
  onRetry: () => void;
}

export function WorkspaceErrorState(props: WorkspaceErrorStateProps) {
  return <ErrorState {...getErrorStateProps(props)} className="min-h-svh" />;
}

function getErrorStateProps({
  error,
  onNavigate,
  onRetry,
}: WorkspaceErrorStateProps): ErrorStateProps {
  if (error instanceof ApiError) {
    if (error.status === 404) {
      return {
        icon: DatabaseXIcon,
        title: "Workspace not found",
        message:
          "We couldn't find the workspace you're trying to access. It may have been deleted, moved, or you may not have access to it.",
        children: <Button onClick={onNavigate}>Go to your workspace</Button>,
      };
    }

    if (error.kind === "network") {
      return {
        icon: CloudOffIcon,
        title: "Unable to connect to the server",
        message:
          "We couldn't load this workspace because there was a problem connecting to the server. Check your connection and try again.",
        children: <Button onClick={onRetry}>Retry loading</Button>,
      };
    }
  }

  return {
    icon: TriangleAlert,
    title: "Something went wrong",
    message:
      "We couldn't load this workspace due to an unexpected error. Please try again, and if the problem continues, contact support.",
    children: <Button onClick={onRetry}>Retry loading</Button>,
  };
}
