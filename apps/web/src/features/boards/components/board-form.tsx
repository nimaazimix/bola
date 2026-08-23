import { Field, FieldError, FieldGroup, FieldLabel } from "@bola/ui/components/field";
import { Input } from "@bola/ui/components/input";
import { Button } from "@bola/ui/components/button";
import { DialogClose, DialogFooter } from "@bola/ui/components/dialog";

import { revalidateLogic, useForm } from "@tanstack/react-form";
import { CreateBoardSchema } from "@bola/contracts/boards";
import { useWorkspaceSlug } from "#/shared/hooks/use-workspace-slug";
import { useCreateBoard } from "../hooks/use-create-board";
import { ApiError } from "#/shared/api/errors";
import { toast } from "sonner";

interface BoardFormProps {
  onCreateBoard: (boardId: string) => void;
  dialog?: boolean;
}

export function BoardForm({ onCreateBoard, dialog = false }: BoardFormProps) {
  const workspaceSlug = useWorkspaceSlug();
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
      } catch (error) {
        if (error instanceof ApiError) {
          return toast.error(error.message);
        }
        toast.error("Something went wrong");
      }
    },
  });

  const submitButton = (
    <form.Subscribe
      selector={(state) => state.isSubmitting}
      children={(isSubmitting) => (
        <Button disabled={isSubmitting}>{isSubmitting ? "Creating board" : "Create board"}</Button>
      )}
    />
  );

  return (
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

      {dialog ? (
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          {submitButton}
        </DialogFooter>
      ) : (
        submitButton
      )}
    </form>
  );
}
