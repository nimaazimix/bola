import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useVerifyEmail } from "../api/use-verify-email";

interface EmailVerificationParams {
  token?: string;
  redirect?: string;
}

export function useEmailVerification({ token, redirect }: EmailVerificationParams) {
  const { mutateAsync: verifyEmail } = useVerifyEmail();
  const navigate = useNavigate();

  useEffect(() => {
    void (async () => {
      if (!token) {
        return navigate({ to: "/auth/signin", search: { redirect }, replace: true });
      }

      try {
        await verifyEmail({ input: { token } });
        navigate({ to: redirect || "/app", replace: true });
      } catch {
        navigate({ to: "/auth/signin", search: { redirect }, replace: true });
      }
    })();
  }, [navigate, redirect, token, verifyEmail]);
}
