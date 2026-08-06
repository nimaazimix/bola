import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "#/shared/stores/auth.store";
import { verifyEmail } from "../api/requests";
import type { VerifyEmailInput } from "@bola/contracts/auth";

export function useVerifyEmail() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: ({ input }: { input: VerifyEmailInput }) => verifyEmail(input),

    onSuccess: ({ accessToken, user }) => {
      setAuth(accessToken, user);
    },
  });
}
