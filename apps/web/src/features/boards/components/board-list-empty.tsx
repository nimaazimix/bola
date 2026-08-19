import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@bola/ui/components/empty";
import { DatabaseXIcon } from "lucide-react";

export function BoardListEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <DatabaseXIcon />
        </EmptyMedia>
        <EmptyTitle>No board available</EmptyTitle>
        <EmptyDescription>
          There is no board available in this workspace with this specific name
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
