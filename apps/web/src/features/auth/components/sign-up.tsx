import { Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@bola/ui/components/card";
import { SignUpForm } from "./sign-up-form";
import { OAuthButtons } from "./oauth-buttons";
import { CheckEmail } from "./check-email";

import { useState } from "react";
import type { SignUpData } from "../types";

interface SignupProps {
  redirect?: string;
}

interface SignUpState {
  step: "create-account" | "verify-email";
  data?: SignUpData;
}

export function SignUp({ redirect }: SignupProps) {
  const [signUpState, setSignUpState] = useState<SignUpState>({ step: "create-account" });

  return signUpState.step === "create-account" ? (
    <Card className="m-4 w-full max-w-sm [--card-spacing:--spacing(5)]">
      <CardHeader>
        <CardTitle>
          <h1 className="text-lg">Create an account</h1>
        </CardTitle>
        <CardDescription>Enter your information to create an account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <SignUpForm
          onSignUp={(data) => setSignUpState({ step: "verify-email", data })}
          data={signUpState.data}
          redirect={redirect}
        />
        <OAuthButtons />
      </CardContent>
      <CardFooter className="py-3">
        <p className="text-muted-foreground mx-auto">
          Already have an account?{" "}
          <Link to="/signin" search={{ redirect }} className="text-primary underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  ) : (
    <CheckEmail
      email={signUpState.data!.email}
      onBackToSignup={() => setSignUpState((prev) => ({ ...prev, step: "create-account" }))}
    />
  );
}
