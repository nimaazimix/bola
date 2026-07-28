import { authHandlers } from "./auth";
import { workspaceHandlers } from "./workspace";

export const handlers = [...authHandlers, ...workspaceHandlers];
