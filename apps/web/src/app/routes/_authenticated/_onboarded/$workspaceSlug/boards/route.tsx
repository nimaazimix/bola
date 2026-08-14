import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_onboarded/$workspaceSlug/boards")({
  staticData: {
    title: () => "Boards",
  },
});
