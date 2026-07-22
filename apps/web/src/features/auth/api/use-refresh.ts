import { useMutation } from "@tanstack/react-query";
import { authApi } from "#/shared/api";
import { useAuthStore } from "#/shared/stores";
import type { ApiSuccess } from "@bola/contracts/api";
import type { AuthPayload } from "@bola/contracts/auth";

export function useRefresh() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: () =>
      authApi.post<ApiSuccess<AuthPayload>>("/auth/refresh").then((res) => res.data.data),

    onSuccess: ({ accessToken, user }) => {
      setAuth(accessToken, user);
    },
    onError: () => {
      clearAuth();
    },
  });
}
