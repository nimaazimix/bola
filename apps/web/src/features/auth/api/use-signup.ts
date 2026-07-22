import { useMutation } from "@tanstack/react-query";
import { authApi } from "#/shared/api";
import type { ApiSuccess } from "@bola/contracts/api";
import type { SignupInput, SignupQuery } from "@bola/contracts/auth";
import type { User } from "@bola/contracts/user";

export function useSignup() {
  return useMutation({
    mutationFn: ({ input, query }: { input: SignupInput; query?: SignupQuery }) =>
      authApi
        .post<ApiSuccess<User>>("/auth/signup", input, { params: query })
        .then((res) => res.data.data),
  });
}
