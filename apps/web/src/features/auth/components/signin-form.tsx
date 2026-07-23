import { Field, FieldError, FieldGroup, FieldLabel } from "@bola/ui/components/field";
import { Input } from "@bola/ui/components/input";
import { Button } from "@bola/ui/components/button";

import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { SigninSchema } from "@bola/contracts/auth";
import { handleSubmitError } from "#/shared/lib";
import { useSignin } from "../api/use-signin";

interface SigninFormProps {
  redirect?: string;
}

export function SigninForm({ redirect }: SigninFormProps) {
  const { mutateAsync: signin } = useSignin();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: SigninSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await signin({ input: value });
        navigate({ to: redirect || "/app" });
      } catch (error) {
        handleSubmitError(error);
      }
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
        {form.state.isSubmitting ? "Signing in" : "Sign in"}
      </Button>
    </form>
  );
}
