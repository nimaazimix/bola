import { ApiErrorPayload } from "@bola/contracts/api";

export const WorkspaceErrors = {
  SLUG_ALREADY_IN_USE: {
    code: "workspace.slug_already_in_use",
    message: "Slug is already in use",
  },

  NOT_FOUND: {
    code: "workspace.not_found",
    message: "Workspace is not found",
  },

  ACCESS_DENIED: {
    code: "workspace.access_denied",
    message: "Workspace cannot be accessed",
  },
} satisfies Record<string, ApiErrorPayload>;
