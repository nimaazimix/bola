import { Factory } from "fishery";
import { User } from "@bola/db";

export const userFactory = Factory.define<User>(({ sequence }) => {
  return {
    id: `usr_${sequence}`,
    name: `User ${sequence}`,
    email: `user${sequence}@example.com`,
    emailVerified: false,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});
