import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "#/shared/stores";
import type { VerifyEmailInput } from "@bola/contracts/auth";
import { veriftEmail } from "./requests";

export function useVerifyEmail() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: ({ input }: { input: VerifyEmailInput }) => veriftEmail(input),

    onSuccess: ({ accessToken, user }) => {
      setAuth(accessToken, user);
    },
  });
}
