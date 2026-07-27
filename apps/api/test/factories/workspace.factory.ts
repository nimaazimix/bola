import { Factory } from "fishery";
import { Workspace } from "@bola/db";

export const workspaceFactory = Factory.define<Workspace>(({ sequence }) => {
  return {
    id: `wsp_${sequence}`,
    name: `Workspace ${sequence}`,
    slug: `workspace-${sequence}`,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});
