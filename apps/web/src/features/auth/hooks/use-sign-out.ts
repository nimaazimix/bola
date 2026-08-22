import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "#/shared/stores/auth.store";
import { signOut } from "../api/requests";

export function useSignOut() {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => signOut(),

    onSuccess: () => {
      queryClient.clear();
      clearAuth();
      navigate({ to: "/sign-in" });
    },
  });
}
