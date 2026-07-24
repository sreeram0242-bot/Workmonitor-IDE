import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Setup Pool with explicit SSL for Vercel + CockroachDB
const connectionString = "postgresql://sreeram:WB0vEQzpERLXKgm7HZOCfQ@horned-tamarin-18679.jxf.gcp-asia-south1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full";

const pool = new Pool({ 
  connectionString: connectionString,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined
});
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ 
  adapter,
  datasourceUrl: connectionString 
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
