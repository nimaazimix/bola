import { useMutation } from "@tanstack/react-query";
import { authApi } from "#/shared/api";
import { useAuthStore } from "#/shared/stores";
import type { ApiSuccess } from "@bola/contracts/api";
import type { AuthPayload, SignInInput } from "@bola/contracts/auth";

export function useSignIn() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: ({ input }: { input: SignInInput }) =>
      authApi.post<ApiSuccess<AuthPayload>>("/auth/signin", input).then((res) => res.data.data),

    onSuccess: ({ accessToken, user }) => {
      setAuth(accessToken, user);
    },
  });
}
