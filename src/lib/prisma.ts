import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

// Set up WebSocket constructor in Node.js environments (outside Vercel Edge runtime)
if (typeof window === "undefined" && !process.env.VERCEL) {
  neonConfig.webSocketConstructor = ws;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return new PrismaClient({
      adapter: new PrismaNeon({
        connectionString: "postgresql://postgres:postgres@localhost:5432/placeholder",
      }),
    });
  }

  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" && process.env.DEBUG_PRISMA ? ["query", "error", "warn"] : ["error"],
  });
}

// Preserve singleton instance in global scope across all serverless & development invocations
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
