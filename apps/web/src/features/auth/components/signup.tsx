import { Link, useSearch } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@bola/ui/components/card";
import { SignupForm } from "./signup-form";
import { OAuthButtons } from "./oauth-buttons";
import { CheckEmail } from "./check-email";

import { useState } from "react";
import type { SignupData } from "../types";

interface SignupState {
  step: "create-account" | "verify-email";
  data?: SignupData;
}

export function Signup() {
  const [signupState, setSignupState] = useState<SignupState>({ step: "create-account" });

  const search = useSearch({ from: "/(auth)/signup" });

  return signupState.step === "create-account" ? (
    <Card className="m-4 w-full max-w-sm [--card-spacing:--spacing(5)]">
      <CardHeader>
        <CardTitle>
          <h1 className="text-lg">Create an account</h1>
        </CardTitle>
        <CardDescription>Enter your information to create an account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <SignupForm
          redirect={search.redirect}
          data={signupState.data}
          onSignup={(data) => setSignupState({ step: "verify-email", data })}
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
      email={signupState.data!.email}
      onBackToSignup={() => setSignupState((prev) => ({ ...prev, step: "create-account" }))}
    />
  );
}
