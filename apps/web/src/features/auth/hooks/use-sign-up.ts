import { useMutation } from "@tanstack/react-query";
import { signUp } from "../api/requests";
import type { SignUpInput, SignUpQuery } from "@bola/contracts/auth";

export function useSignUp() {
  return useMutation({
    mutationFn: ({ input, query }: { input: SignUpInput; query?: SignUpQuery }) =>
      signUp(input, query),
  });
}
