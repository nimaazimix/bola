import { PrismaPg } from "@prisma/adapter-pg";

export function createAdapterPg() {
  return new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
}
