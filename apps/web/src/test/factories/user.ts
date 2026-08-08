import { Factory } from "fishery";
import type { User } from "@bola/contracts/users";

export const userFactory = Factory.define<User>(({ sequence }) => {
  return {
    id: `usr_${sequence}`,
    name: `User ${sequence}`,
    email: `user${sequence}@example.com`,
    image: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
});
