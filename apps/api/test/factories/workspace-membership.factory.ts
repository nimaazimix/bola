import { Factory } from "fishery";
import { WorkspaceMembership, WorkspaceRole } from "@bola/db";

export const WorkspaceMembershipFactory = Factory.define<WorkspaceMembership>(({ sequence }) => {
  return {
    workspaceId: `wsp_${sequence}`,
    userId: `usr_${sequence}`,
    role: WorkspaceRole.OWNER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});
