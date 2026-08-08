import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "#/shared/stores/auth.store";
import { signOut } from "../api/requests";

export function useSignOut() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => signOut(),

    onSuccess: () => {
      clearAuth();
      navigate({ to: "/signin" });
    },
  });
}
