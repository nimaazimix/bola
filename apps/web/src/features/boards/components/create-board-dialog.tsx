import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@bola/ui/components/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@bola/ui/components/field";
import { Input } from "@bola/ui/components/input";
import { Button } from "@bola/ui/components/button";

import React, { useState } from "react";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { CreateBoardSchema } from "@bola/contracts/boards";
import { useCreateBoard } from "../hooks/use-create-board";
import { ApiError } from "#/shared/api/errors";
import { toast } from "sonner";

interface CreateBoardDialogProps extends React.PropsWithChildren {
  workspaceSlug: string;
  onCreateBoard: (boardId: string) => void;
}

export function CreateBoardDialog({
  workspaceSlug,
  onCreateBoard,
  children,
}: CreateBoardDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: CreateBoard } = useCreateBoard(workspaceSlug);

  const form = useForm({
    defaultValues: {
      name: "",
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: CreateBoardSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const board = await CreateBoard({ input: value });
        onCreateBoard(board.id);

        setOpen(false);
        form.reset();
      } catch (error) {
        if (error instanceof ApiError) {
          return toast.error(error.message);
        }
        toast.error("Something went wrong");
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create board</DialogTitle>
          <DialogDescription>
            Give your board a name to get started. You can add tasks, decisions, and more once it's
            created.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      data-invalid={isInvalid}
                      placeholder="e.g. Product Planning"
                    />
                    {isInvalid && <FieldError>{field.state.meta.errors[0]!.message}</FieldError>}
                  </Field>
                );
              }}
            />
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <form.Subscribe
              selector={(state) => state.isSubmitting}
              children={(isSubmitting) => (
                <Button disabled={isSubmitting}>
                  {isSubmitting ? "Creating board" : "Create board"}
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
