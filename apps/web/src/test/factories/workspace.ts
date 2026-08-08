import { Factory } from "fishery";
import type { Workspace } from "@bola/contracts/workspaces";

export const workspaceFactory = Factory.define<Workspace>(({ sequence }) => {
  return {
    id: `wsp_${sequence}`,
    name: `Workspace ${sequence}`,
    slug: `workspace-${sequence}`,
    image: null,
    membership: { role: "OWNER" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
});
