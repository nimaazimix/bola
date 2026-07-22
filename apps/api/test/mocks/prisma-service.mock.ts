import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaClient } from "@bola/db";

export function createPrismaServiceMock() {
  return mockDeep<PrismaClient>();
}

export type PrismaServiceMock = DeepMockProxy<PrismaClient>;
