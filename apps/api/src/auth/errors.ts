import { ApiErrorPayload } from "@bola/contracts/api";

export const AuthErrors = {
  EMAIL_ALREADY_IN_USE: {
    code: "auth.email_already_in_use",
    message: "Email address is already in use",
  },

  EMAIL_NOT_VERIFIED: {
    code: "auth.email_not_verified",
    message: "Email address has not been verified",
  },

  CREDENTIALS_INVALID: {
    code: "auth.credentials_invalid",
    message: "Email address or password is incorrect",
  },

  VERIFICATION_INVALID: {
    code: "auth.verification_invalid",
    message: "Verification is invalid",
  },

  VERIFICATION_EXPIRED: {
    code: "auth.verification_expired",
    message: "Verification is expired",
  },

  SESSION_INVALID: {
    code: "auth.session_invalid",
    message: "Session is missing or invalid",
  },

  SESSION_EXPIRED: {
    code: "auth.session_expired",
    message: "Session is expired",
  },

  ACCESS_TOKEN_INVALID: {
    code: "auth.access_token_invalid",
    message: "Access token is missing or invalid",
  },

  ACCESS_TOKEN_EXPIRED: {
    code: "auth.access_token_expired",
    message: "Access token is expired",
  },

  USER_NOT_FOUND: {
    code: "auth.user_not_found",
    message: "Authenticated user no longer exists",
  },
} satisfies Record<string, ApiErrorPayload>;
