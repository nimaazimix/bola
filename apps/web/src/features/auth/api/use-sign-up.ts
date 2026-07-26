import { useMutation } from "@tanstack/react-query";
import { authApi } from "#/shared/api";
import type { ApiSuccess } from "@bola/contracts/api";
import type { SignUpInput, SignUpQuery } from "@bola/contracts/auth";
import type { User } from "@bola/contracts/users";

export function useSignUp() {
  return useMutation({
    mutationFn: ({ input, query }: { input: SignUpInput; query?: SignUpQuery }) =>
      authApi
        .post<ApiSuccess<User>>("/auth/signup", input, { params: query })
        .then((res) => res.data.data),
  });
}
