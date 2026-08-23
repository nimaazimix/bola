import { useParams } from "@tanstack/react-router";

export function useWorkspaceSlug() {
  const { workspaceSlug } = useParams({ from: "/_authenticated/_onboarded/$workspaceSlug" });

  return workspaceSlug;
}
