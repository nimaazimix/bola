import { Factory } from "fishery";
import { Board } from "@bola/db";

export const boardFactory = Factory.define<Board>(({ sequence }) => {
  return {
    id: `brd_${sequence}`,
    workspaceId: `wsp_${sequence}`,
    name: `Board ${sequence}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});
