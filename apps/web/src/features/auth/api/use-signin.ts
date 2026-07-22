import { useMutation } from "@tanstack/react-query";
import { authApi } from "#/shared/api";
import { useAuthStore } from "#/shared/stores";
import type { ApiSuccess } from "@bola/contracts/api";
import type { AuthPayload, SigninInput } from "@bola/contracts/auth";

export function useSignin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: ({ input }: { input: SigninInput }) =>
      authApi.post<ApiSuccess<AuthPayload>>("/auth/signin", input).then((res) => res.data.data),

    onSuccess: ({ accessToken, user }) => {
      setAuth(accessToken, user);
    },
  });
}
