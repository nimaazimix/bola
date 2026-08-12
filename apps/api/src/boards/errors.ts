import { ApiErrorPayload } from "@bola/contracts/api";

export const BoardErrors = {
  NOT_FOUND: {
    code: "board.not_found",
    message: "Board is not found",
  },
} satisfies Record<string, ApiErrorPayload>;
