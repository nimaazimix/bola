import { api } from "#/shared/api/client";
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
  return api
    .post<ApiSuccess<User>>("/auth/signup", input, { params: query })
    .then((res) => res.data.data);
}

export async function verifyEmail(input: VerifyEmailInput) {
  return api
    .post<ApiSuccess<AuthPayload>>("/auth/verify-email", input, { withCredentials: true })
    .then((res) => res.data.data);
}

export async function signIn(input: SignInInput) {
  return api
    .post<ApiSuccess<AuthPayload>>("/auth/signin", input, { withCredentials: true })
    .then((res) => res.data.data);
}

export async function refresh() {
  return api
    .post<ApiSuccess<AuthPayload>>("/auth/refresh", undefined, { withCredentials: true })
    .then((res) => res.data.data);
}

export async function signOut() {
  return api
    .post<ApiSuccess<never>>("/auth/signout", undefined, { withCredentials: true })
    .then((res) => res.data.data);
}
