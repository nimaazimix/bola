import { Field, FieldError, FieldGroup, FieldLabel } from "@bola/ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@bola/ui/components/input-group";
import { Input } from "@bola/ui/components/input";
import { Button } from "@bola/ui/components/button";

import { useState } from "react";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { CreateWorkspaceSchema } from "@bola/contracts/workspaces";
import slugify from "slugify";
import { toast } from "sonner";
import { ApiError } from "#/shared/api/errors";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { checkSlug } from "../api/requests";

export function CreateWorkspaceForm() {
  const { mutateAsync: createWorkspace } = useCreateWorkspace();
  const navigate = useNavigate();

  const [slugEdited, setSlugEdited] = useState(false);
  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      try {
        const workspace = await createWorkspace({ input: value });
        navigate({ to: "/$workspaceSlug", params: { workspaceSlug: workspace.slug } });
      } catch (error) {
        if (error instanceof ApiError) {
          return toast.error(error.message);
        }
        toast.error("Something went wrong");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-5"
    >
      <FieldGroup>
        <form.Field
          name="name"
          validators={{
            onDynamic: CreateWorkspaceSchema.shape.name,
          }}
          listeners={{
            onChange: ({ value }) => {
              if (!slugEdited) {
                form.setFieldValue(
                  "slug",
                  slugify(value, {
                    lower: true,
                    strict: true,
                  }),
                );
              }
            },
          }}
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
                  placeholder="Acme Inc."
                />
                {isInvalid && <FieldError>{field.state.meta.errors[0]!.message}</FieldError>}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <FieldGroup>
        <form.Field
          name="slug"
          validators={{
            onDynamic: CreateWorkspaceSchema.shape.slug,
            onDynamicAsyncDebounceMs: 500,
            onDynamicAsync: async ({ value, fieldApi }) => {
              const error = fieldApi.parseValueWithSchema(CreateWorkspaceSchema.shape.slug);
              if (error) return error;
              try {
                const { available } = await checkSlug(value);
                if (!available) {
                  return { message: "This workspace URL is unavailable" };
                }
              } catch {
                return { message: "Unable to verify slug availability" };
              }
            },
          }}
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>URL</FieldLabel>
                <InputGroup>
                  <InputGroupAddon className="border-r pr-1.5">
                    <InputGroupText>bola.app/</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      setSlugEdited(true);
                      field.handleChange(e.target.value);
                    }}
                    data-invalid={isInvalid}
                    placeholder="acme-inc"
                  />
                </InputGroup>
                {isInvalid && <FieldError>{field.state.meta.errors[0]!.message}</FieldError>}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <form.Subscribe
        selector={(state) => state.isSubmitting}
        children={(isSubmitting) => (
          <Button size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating workspace" : "Create workspace"}
          </Button>
        )}
      />
    </form>
  );
}
