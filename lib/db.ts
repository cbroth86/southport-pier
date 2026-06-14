import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma singleton — avoids exhausting Postgres connections during dev HMR.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Driver-adapter client: queries run through the `pg` JS driver (no native engine).
// The pg pool connects lazily, so an absent DATABASE_URL (e.g. preview deploys)
// is harmless — the data layer guards with hasDatabase() before querying.
function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
