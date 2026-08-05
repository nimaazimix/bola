import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bola/ui/components/card";
import { CreateWorkspaceForm } from "./create-workspace-form";
import { useNavigate } from "@tanstack/react-router";

export function WorkspaceOnboarding() {
  const navigate = useNavigate();

  return (
    <div className="m-4 w-full max-w-md space-y-6">
      <h1 className="text-center text-3xl font-medium">Let's setup your first workspace</h1>
      <Card>
        <CardHeader>
          <CardTitle>Create workspace</CardTitle>
          <CardDescription>
            Your workspace is where you'll organize boards, settings, and teammates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateWorkspaceForm
            onCreateWorkspace={(workspaceSlug) =>
              navigate({ to: "/$workspaceSlug", params: { workspaceSlug } })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
