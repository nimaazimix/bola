import { toast } from "sonner";
import { AxiosError } from "axios";
import type { ApiError } from "@bola/contracts/api";

export function handleSubmitError(error: unknown) {
  if (error instanceof AxiosError && error.response) {
    const apiError = error.response.data as ApiError;
    if (apiError.error.code === "common.validation_failed") {
      // TODO: Map issues
      return;
    } else {
      toast.error(apiError.error.message);
    }
  } else {
    toast.error("Something went wrong");
  }
}
