import { Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@bola/ui/components/card";
import { SignInForm } from "./sign-in-form";
import { OAuthButtons } from "./oauth-buttons";

interface SignInProps {
  onSignIn: () => void;
  redirect?: string;
}

export function SignIn({ onSignIn, redirect }: SignInProps) {
  return (
    <Card className="m-4 w-full max-w-sm [--card-spacing:--spacing(5)]">
      <CardHeader>
        <CardTitle>
          <h1>Welcome back</h1>
        </CardTitle>
        <CardDescription>Enter your credentials to sign in to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <SignInForm onSignIn={onSignIn} />
        <OAuthButtons />
      </CardContent>
      <CardFooter className="py-3">
        <p className="text-muted-foreground mx-auto">
          Doesn&apos;t have an account?{" "}
          <Link to="/sign-up" search={{ redirect }} className="text-primary underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
