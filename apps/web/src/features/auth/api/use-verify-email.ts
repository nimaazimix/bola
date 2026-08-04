import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "#/shared/stores/auth.store";
import type { VerifyEmailInput } from "@bola/contracts/auth";
import { verifyEmail } from "./requests";

export function useVerifyEmail() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: ({ input }: { input: VerifyEmailInput }) => verifyEmail(input),

    onSuccess: ({ accessToken, user }) => {
      setAuth(accessToken, user);
    },
  });
}
