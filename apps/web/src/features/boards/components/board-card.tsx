import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@bola/ui/components/card";
import { Button } from "@bola/ui/components/button";
import type { Board } from "@bola/contracts/boards";
import { Link } from "@tanstack/react-router";

interface BoardCardProps {
  board: Board;
}

export function BoardCard({ board }: BoardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{board.name}</CardTitle>
        <CardDescription>Lorem ipsum dolor, sit amet consectetur adipisicing.</CardDescription>
      </CardHeader>

      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link
            from="/$workspaceSlug/boards"
            to="/$workspaceSlug/boards/$boardId"
            params={{ boardId: board.id }}
          >
            View board
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
