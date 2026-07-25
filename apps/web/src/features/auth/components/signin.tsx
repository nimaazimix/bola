import { Link, useSearch } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@bola/ui/components/card";
import { SigninForm } from "./signin-form";
import { OAuthButtons } from "./oauth-buttons";

export function Signin() {
  const search = useSearch({ from: "/(auth)/signin" });

  return (
    <Card className="m-4 w-full max-w-sm [--card-spacing:--spacing(5)]">
      <CardHeader>
        <CardTitle>
          <h1 className="text-lg">Welcome back</h1>
        </CardTitle>
        <CardDescription>Enter your credentials to sign in to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <SigninForm redirect={search.redirect} />
        <OAuthButtons />
      </CardContent>
      <CardFooter className="py-3">
        <p className="text-muted-foreground mx-auto">
          Doesn&apos;t have an account?{" "}
          <Link
            to="/signup"
            search={{ redirect: search.redirect }}
            className="text-primary underline"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
