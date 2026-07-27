import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = "postgresql://sreeram:WB0vEQzpERLXKgm7HZOCfQ@horned-tamarin-18679.jxf.gcp-asia-south1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full";
process.env.DATABASE_URL = connectionString;

const globalForPrisma = globalThis as unknown as { 
  prisma?: PrismaClient;
  pool?: Pool;
};

const pool = globalForPrisma.pool || new Pool({ 
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined
});

if (process.env.NODE_ENV !== "production") globalForPrisma.pool = pool;

const adapter = new PrismaPg(pool);

function getPrismaInstance(): PrismaClient {
  if (globalForPrisma.prisma && (globalForPrisma.prisma as any).project) {
    return globalForPrisma.prisma;
  }
  const client = new PrismaClient({ adapter });
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const instance = getPrismaInstance() as any;
    const value = Reflect.get(instance, prop, receiver);
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});
