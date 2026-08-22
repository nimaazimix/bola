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
  const res = await api.post<ApiSuccess<User>>("/auth/sign-up", input, { params: query });
  return res.data.data;
}

export async function verifyEmail(input: VerifyEmailInput) {
  const res = await api.post<ApiSuccess<AuthPayload>>("/auth/verify-email", input, {
    withCredentials: true,
  });
  return res.data.data;
}

export async function signIn(input: SignInInput) {
  const res = await api.post<ApiSuccess<AuthPayload>>("/auth/sign-in", input, {
    withCredentials: true,
  });
  return res.data.data;
}

export async function refresh() {
  const res = await api.post<ApiSuccess<AuthPayload>>("/auth/refresh", undefined, {
    withCredentials: true,
  });
  return res.data.data;
}

export async function signOut() {
  const res = await api.post<ApiSuccess<never>>("/auth/sign-out", undefined, {
    withCredentials: true,
  });
  return res.data.data;
}
