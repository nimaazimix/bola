import { Button } from "@bola/ui/components/button";
import { GoogleIcon } from "./icons/google.icon";
import { GithubIcon } from "./icons/github.icon";

export function OAuthButtons() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button size="lg" variant="outline">
        <GoogleIcon className="size-4.5" />
      </Button>
      <Button size="lg" variant="outline">
        <GithubIcon className="size-4.5" />
      </Button>
    </div>
  );
}
