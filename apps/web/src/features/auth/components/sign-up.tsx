import { Link, useSearch } from "@tanstack/react-router";
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

interface SignUpState {
  step: "create-account" | "verify-email";
  data?: SignUpData;
}

export function SignUp() {
  const [signUpState, setSignUpState] = useState<SignUpState>({ step: "create-account" });

  const search = useSearch({ from: "/(auth)/signup" });

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
          redirect={search.redirect}
          data={signUpState.data}
          onSignUp={(data) => setSignUpState({ step: "verify-email", data })}
        />
        <OAuthButtons />
      </CardContent>
      <CardFooter className="py-3">
        <p className="text-muted-foreground mx-auto">
          Already have an account?{" "}
          <Link
            to="/signin"
            search={{ redirect: search.redirect }}
            className="text-primary underline"
          >
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
