import { Factory } from "fishery";
import { Session } from "@bola/db";
import { after } from "src/common/utils";

export const sessionFactory = Factory.define<Session>(({ sequence }) => {
  return {
    id: `ses_${sequence}`,
    userId: `usr_${sequence}`,
    refreshTokenHash: "hashed-token",
    userAgent: "agent",
    expiresAt: after("7d"),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});
