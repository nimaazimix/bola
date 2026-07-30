import axios from "axios";
import type { ApiError } from "@bola/contracts/api";

export function getAxiosErrorData<T = ApiError>(error: unknown): T | undefined {
  if (!axios.isAxiosError(error) || !error.response) {
    return undefined;
  }

  return error.response.data as T;
}
