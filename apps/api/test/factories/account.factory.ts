import { Factory } from "fishery";
import { Account, Provider } from "@bola/db";

export const accountFactory = Factory.define<Account>(({ sequence }) => {
  return {
    id: `acc_${sequence}`,
    userId: `usr_${sequence}`,
    providerId: Provider.credentials,
    accountId: `user${sequence}@example.com`,
    passwordHash: "hashed-password",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});
