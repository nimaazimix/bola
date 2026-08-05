import { useMutation } from "@tanstack/react-query";
import type { SignUpInput, SignUpQuery } from "@bola/contracts/auth";
import { signUp } from "../api/requests";

export function useSignUp() {
  return useMutation({
    mutationFn: ({ input, query }: { input: SignUpInput; query?: SignUpQuery }) =>
      signUp(input, query),
  });
}
