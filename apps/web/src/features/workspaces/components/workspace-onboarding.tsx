import { Card, CardContent } from "@bola/ui/components/card";
import { CreateWorkspaceForm } from "./create-workspace-form";

export function WorkspaceOnboarding() {
  return (
    <div className="m-4 w-full max-w-sm space-y-8">
      <h1 className="text-center text-3xl font-medium">Let's setup your first workspace</h1>
      <Card>
        <CardContent>
          <CreateWorkspaceForm />
        </CardContent>
      </Card>
    </div>
  );
}
