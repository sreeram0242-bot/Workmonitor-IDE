import { n as Pool, t as PrismaPgAdapterFactory } from "../_libs/@prisma/adapter-pg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/prisma-B-Q1fYN8.js
var adapter = new PrismaPgAdapterFactory(new Pool({
	connectionString: process.env.DATABASE_URL || "",
	ssl: { rejectUnauthorized: false }
}));
var prisma = globalThis.prisma || new PrismaClientImpl({ adapter });
//#endregion
export { prisma as t };
