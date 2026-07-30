import { authHandlers } from "./auth";
import { workspacesHandlers } from "./workspaces";

export const handlers = [...authHandlers, ...workspacesHandlers];
