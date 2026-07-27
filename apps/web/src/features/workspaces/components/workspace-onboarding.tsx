import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bola/ui/components/card";
import { CreateWorkspaceForm } from "./create-workspace-form";

export function WorkspaceOnboarding() {
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
          <CreateWorkspaceForm />
        </CardContent>
      </Card>
    </div>
  );
}
