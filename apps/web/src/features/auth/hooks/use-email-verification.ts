import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useVerifyEmail } from "../api/use-verify-email";
import { resolveDestination } from "../lib/resolve-destination";

interface EmailVerificationParams {
  token?: string;
  redirect?: string;
}

export function useEmailVerification({ token, redirect }: EmailVerificationParams) {
  const { mutateAsync: verifyEmail } = useVerifyEmail();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    void (async () => {
      if (!token) {
        return navigate({ to: "/signin", search: { redirect }, replace: true });
      }

      try {
        await verifyEmail({ input: { token } });

        const destination = await resolveDestination(queryClient, redirect);
        navigate({ ...destination, replace: true });
      } catch {
        navigate({ to: "/signin", search: { redirect }, replace: true });
      }
    })();
  }, [navigate, queryClient, redirect, token, verifyEmail]);
}
