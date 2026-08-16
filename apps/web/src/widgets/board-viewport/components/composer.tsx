import { Button } from "@bola/ui/components/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@bola/ui/components/input-group";
import { ArrowUpIcon, PlusIcon, SmilePlusIcon } from "lucide-react";

export function Composer() {
  return (
    <div className="mx-auto flex w-full max-w-200 items-center gap-2 px-4 pb-4">
      <InputGroup className="h-9 rounded-full">
        <InputGroupAddon>
          <InputGroupButton size="icon-sm" className="rounded-full">
            <SmilePlusIcon />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupInput placeholder="Write your message..." />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-sm" className="rounded-full">
            <ArrowUpIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <Button size="icon" variant="outline" className="size-9 rounded-full">
        <PlusIcon />
      </Button>
    </div>
  );
}
