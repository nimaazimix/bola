import { Field, FieldError, FieldGroup, FieldLabel } from "@bola/ui/components/field";
import { Input } from "@bola/ui/components/input";
import { Button } from "@bola/ui/components/button";

import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { SignInSchema } from "@bola/contracts/auth";
import { toast } from "sonner";
import { getAxiosErrorData } from "#/shared/api";
import { useSignIn } from "../api/use-sign-in";
import { resolveDestination } from "../lib/resolve-destination";

interface SignInFormProps {
  redirect?: string;
}

export function SignInForm({ redirect }: SignInFormProps) {
  const { mutateAsync: signIn } = useSignIn();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

        const destination = await resolveDestination(queryClient, redirect);
        navigate({ ...destination, replace: true });
      } catch (error) {
        const apiError = getAxiosErrorData(error);
        if (apiError) {
          toast.error(apiError.error.message);
        }
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
            {isSubmitting ? "SignIng in" : "Sign in"}
          </Button>
        )}
      />
    </form>
  );
}
