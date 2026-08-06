import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "#/shared/stores/auth.store";
import { signIn } from "../api/requests";
import type { SignInInput } from "@bola/contracts/auth";

export function useSignIn() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: ({ input }: { input: SignInInput }) => signIn(input),

    onSuccess: ({ accessToken, user }) => {
      setAuth(accessToken, user);
    },
  });
}
