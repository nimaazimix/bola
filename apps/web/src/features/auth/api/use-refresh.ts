import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "#/shared/stores";
import { refresh } from "./requests";

export function useRefresh() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: () => refresh(),

    onSuccess: ({ accessToken, user }) => {
      setAuth(accessToken, user);
    },
    onError: () => {
      clearAuth();
    },
  });
}
