import { Field, FieldError, FieldGroup, FieldLabel } from "@bola/ui/components/field";
import { Input } from "@bola/ui/components/input";
import { Button } from "@bola/ui/components/button";

import { revalidateLogic, useForm } from "@tanstack/react-form";
import { SignInSchema } from "@bola/contracts/auth";
import { useSignIn } from "../hooks/use-sign-in";
import { ApiError } from "#/shared/api/errors";
import { toast } from "sonner";

interface SignInFormProps {
  onSignIn: () => void;
}

export function SignInForm({ onSignIn }: SignInFormProps) {
  const { mutateAsync: signIn } = useSignIn();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: SignInSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await signIn({ input: value });
        onSignIn();
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
      className="space-y-4"
    >
      <FieldGroup>
        <form.Field
          name="email"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
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
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
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

      <form.Subscribe
        selector={(state) => state.isSubmitting}
        children={(isSubmitting) => (
          <Button size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "signing in" : "Sign in"}
          </Button>
        )}
      />
    </form>
  );
}
