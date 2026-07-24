import { createRequire } from "module";
import type { PrismaClient } from "@prisma/client";
const require = createRequire(import.meta.url);
const { PrismaClient: PrismaClientImpl } = require("@prisma/client");
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Setup Pool with explicit SSL for Vercel + CockroachDB
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL || "",
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined
});
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClientImpl({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
