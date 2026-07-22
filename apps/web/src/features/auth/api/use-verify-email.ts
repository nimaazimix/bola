import { useMutation } from "@tanstack/react-query";
import { authApi } from "#/shared/api";
import { useAuthStore } from "#/shared/stores";
import type { ApiSuccess } from "@bola/contracts/api";
import type { AuthPayload, VerifyEmailInput } from "@bola/contracts/auth";

export function useVerifyEmail() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: ({ input }: { input: VerifyEmailInput }) =>
      authApi
        .post<ApiSuccess<AuthPayload>>("/auth/verify-email", input)
        .then((res) => res.data.data),

    onSuccess: ({ accessToken, user }) => {
      setAuth(accessToken, user);
    },
  });
}
