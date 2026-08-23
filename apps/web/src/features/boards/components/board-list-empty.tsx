import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@bola/ui/components/empty";
import { Button } from "@bola/ui/components/button";
import { BoardDialog } from "./board-dialog";
import { FileIcon, SearchIcon } from "lucide-react";

const data = {
  "no-boards": {
    icon: FileIcon,
    title: "No boards yet",
    description: "You don't have any boards yet. Create your first board to get started.",
  },
  "no-result": {
    icon: SearchIcon,
    title: "No boards found",
    description:
      "We couldn't find any board you're looking for. Clear your search to see all available boards.",
  },
};

interface BoardListEmptyProps {
  type: "no-boards" | "no-result";
  onClear: () => void;
}

export function BoardListEmpty({ type, onClear }: BoardListEmptyProps) {
  const state = data[type];

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <state.icon />
        </EmptyMedia>
        <EmptyTitle>{data[type].title}</EmptyTitle>
        <EmptyDescription>{data[type].description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {type === "no-boards" ? (
          <BoardDialog trigger={<Button>Create board</Button>} />
        ) : (
          <Button onClick={onClear}>Clear search</Button>
        )}
      </EmptyContent>
    </Empty>
  );
}
