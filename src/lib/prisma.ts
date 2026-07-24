import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

let prismaInstance: PrismaClient | null = null;

export const getPrisma = (): PrismaClient => {
  if (prismaInstance) return prismaInstance;
  
  try {
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined
    });
    const adapter = new PrismaPg(pool);
    prismaInstance = new PrismaClient({ adapter });
    return prismaInstance;
  } catch (error) {
    console.error("Failed to initialize Prisma:", error);
    throw error;
  }
};

// Export a proxy so existing `prisma.model.query` calls still work
export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    const client = getPrisma();
    return (client as any)[prop];
  }
});
