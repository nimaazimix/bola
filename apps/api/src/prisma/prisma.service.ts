import { Injectable } from "@nestjs/common";
import { PrismaClient, createAdapterPg } from "@bola/db";

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({ adapter: createAdapterPg() });
  }
}

export * from "@bola/db";
