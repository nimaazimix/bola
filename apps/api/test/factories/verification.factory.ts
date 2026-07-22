import { Factory } from "fishery";
import { Verification, VerificationType } from "@bola/db";
import { after } from "src/common/utils";

export const verificationFactory = Factory.define<Verification>(({ sequence }) => {
  return {
    id: `vrf_${sequence}`,
    userId: `usr_${sequence}`,
    type: VerificationType.email_verification,
    tokenHash: "hashed-token",
    expiresAt: after("1d"),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});
