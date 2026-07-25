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

export const prisma = globalForPrisma.prisma || new PrismaClient({ 
  adapter
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
