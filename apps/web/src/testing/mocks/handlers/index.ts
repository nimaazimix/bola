import { authHandlers } from "./auth";
import { workspacesHandlers } from "./workspaces";
import { boardsHandlers } from "./boards";

export const handlers = [...authHandlers, ...workspacesHandlers, ...boardsHandlers];
