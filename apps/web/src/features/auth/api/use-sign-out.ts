import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "#/shared/stores/auth.store";
import { signOut } from "./requests";

export function useSignOut() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: () => signOut(),

    onSuccess: () => {
      clearAuth();
      navigate({ to: "/signin" });
    },
  });
}
