import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@bola/ui/components/empty";
import { FolderIcon } from "lucide-react";

interface BoardsEmptyProps extends React.ComponentProps<typeof Empty> {
  title?: string;
  description?: string;
}

export function BoardsEmpty({
  title = "No boards yet",
  description = "You don't have any boards yet. Create your first board to get started",
  children,
}: BoardsEmptyProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderIcon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{children}</EmptyContent>
    </Empty>
  );
}
