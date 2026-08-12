import { ApiErrorPayload } from "@bola/contracts/api";

export const BoardErrors = {
  NOT_FOUND: {
    code: "board.not_found",
    message: "Board is not found",
  },

  CREATE_FORBIDDEN: {
    code: "board.create_forbidden",
    message: "You do not have permission to create boards in this workspace",
  },
} satisfies Record<string, ApiErrorPayload>;
