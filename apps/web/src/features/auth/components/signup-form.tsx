import { Field, FieldError, FieldGroup, FieldLabel } from "@bola/ui/components/field";
import { Input } from "@bola/ui/components/input";
import { Button } from "@bola/ui/components/button";

import { revalidateLogic, useForm } from "@tanstack/react-form";
import { SignupSchema } from "@bola/contracts/auth";
import { handleSubmitError } from "#/shared/lib";
import { useSignup } from "../api/use-signup";
import type { SignupData } from "../types";

interface SignupFormProps {
  redirect?: string;
  data?: SignupData;
  onSignup: (data: SignupData) => void;
}

export function SignupForm({ redirect, data, onSignup }: SignupFormProps) {
  const { mutateAsync: signup } = useSignup();

  const form = useForm({
    defaultValues: {
      name: data?.name || "",
      email: data?.email || "",
      password: "",
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: SignupSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          await signup({ input: value, query: { redirect } });
          onSignup({ name: value.name, email: value.email });
        } catch (error) {
          handleSubmitError(error);
        }
      },
    },
  });

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
                <FieldLabel htmlFor={field.name}>Name:</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  data-invalid={isInvalid}
                  placeholder="John Doe"
                />
                {isInvalid && <FieldError>{field.state.meta.errors[0]!.message}</FieldError>}
              </Field>
            );
          }}
        />

        <form.Field
          name="email"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email:</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  data-invalid={isInvalid}
                  placeholder="john.doe@example.com"
                />
                {isInvalid && <FieldError>{field.state.meta.errors[0]!.message}</FieldError>}
              </Field>
            );
          }}
        />

        <form.Field
          name="password"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Password:</FieldLabel>
                <Input
                  type="password"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  data-invalid={isInvalid}
                  placeholder="********"
                />
                {isInvalid && <FieldError>{field.state.meta.errors[0]!.message}</FieldError>}
              </Field>
            );
          }}
        />
      </FieldGroup>

      <Button size="lg" className="w-full" disabled={form.state.isSubmitting}>
        {form.state.isSubmitting ? "Signing up" : "Sign up"}
      </Button>
    </form>
  );
}
