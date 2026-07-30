import { authApi } from "#/shared/api";
import type { ApiSuccess } from "@bola/contracts/api";
import type {
  AuthPayload,
  SignInInput,
  SignUpInput,
  SignUpQuery,
  VerifyEmailInput,
} from "@bola/contracts/auth";
import type { User } from "@bola/contracts/users";

export async function signUp(input: SignUpInput, query?: SignUpQuery) {
  return authApi
    .post<ApiSuccess<User>>("/auth/signup", input, { params: query })
    .then((res) => res.data.data);
}

export async function verifyEmail(input: VerifyEmailInput) {
  return authApi
    .post<ApiSuccess<AuthPayload>>("/auth/verify-email", input)
    .then((res) => res.data.data);
}

export async function signIn(input: SignInInput) {
  return authApi.post<ApiSuccess<AuthPayload>>("/auth/signin", input).then((res) => res.data.data);
}

export async function refresh() {
  return authApi.post<ApiSuccess<AuthPayload>>("/auth/refresh").then((res) => res.data.data);
}
