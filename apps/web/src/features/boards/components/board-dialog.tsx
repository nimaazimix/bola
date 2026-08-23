import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@bola/ui/components/dialog";
import { BoardForm } from "./board-form";

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

interface BoardDialogProps {
  trigger: React.ReactNode;
}

export function BoardDialog({ trigger }: BoardDialogProps) {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate({ from: "/$workspaceSlug" });

  function handleCreateBoard(boardId: string) {
    navigate({ to: "/$workspaceSlug/boards/$boardId", params: { boardId } });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create board</DialogTitle>
          <DialogDescription>
            Give your board a name to get started. You can add tasks, decisions, and more once it's
            created.
          </DialogDescription>
        </DialogHeader>

        <BoardForm onCreateBoard={handleCreateBoard} dialog />
      </DialogContent>
    </Dialog>
  );
}
