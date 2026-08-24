import { Factory } from "fishery";
import type { Board } from "@bola/contracts/boards";

export const boardFactory = Factory.define<Board>(({ sequence }) => {
  return {
    id: `brd_${sequence}`,
    name: `Board ${sequence}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
});
