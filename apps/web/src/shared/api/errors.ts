import { isAxiosError } from "axios";
import type { ApiError as ResponseApiError } from "@bola/contracts/api";

export type ApiErrorKind = "http" | "network" | "unknown";

interface ApiErrorConstructorParameters {
  message: string;
  kind: ApiErrorKind;
  status?: number;
  code?: string;
  details?: unknown;
  options?: ErrorOptions;
}

export class ApiError extends Error {
  kind: ApiErrorKind;
  status?: number;
  code?: string;
  details?: unknown;

  constructor({ message, kind, status, code, details, options }: ApiErrorConstructorParameters) {
    super(message, options);

    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function toApiError(error: unknown): ApiError {
  if (!isAxiosError(error)) {
    return new ApiError({
      kind: "unknown",
      message: "Something went wrong",
      options: { cause: error },
    });
  }

  if (error.response) {
    const data = error.response.data as ResponseApiError;

    return new ApiError({
      kind: "http",
      status: error.response.status,
      message: data.error.message,
      code: data.error.code,
      details: data.error.details,
      options: { cause: error },
    });
  }

  if (error.request) {
    return new ApiError({
      kind: "network",
      message: "Unable to connect to the server",
      options: { cause: error },
    });
  }

  return new ApiError({
    kind: "unknown",
    message: "Something went wrong",
    options: { cause: error },
  });
}
