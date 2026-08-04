import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "#/shared/stores/auth.store";
import type { SignInInput } from "@bola/contracts/auth";
import { signIn } from "./requests";

export function useSignIn() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: ({ input }: { input: SignInInput }) => signIn(input),

    onSuccess: ({ accessToken, user }) => {
      setAuth(accessToken, user);
    },
  });
}
