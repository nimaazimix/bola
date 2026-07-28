import axios from "axios";
import type { ApiError } from "@bola/contracts/api";
import { toast } from "sonner";

export function getAxiosErrorData<T = ApiError>(
  error: unknown,
  { toast: toastOption = true }: { toast?: boolean } = {},
): T | undefined {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.data as T;
  }

  if (toastOption) {
    toast.error("Something went wrong");
  }
}
