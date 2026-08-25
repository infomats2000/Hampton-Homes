import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

// Set up WebSocket support for Neon in Node.js environments
if (typeof window === "undefined" && !process.env.VERCEL) {
  neonConfig.webSocketConstructor = ws;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    // If not set yet (e.g. during build-time page rendering), provide standard fallback or throw if called
    return new PrismaClient({
      adapter: new PrismaNeon({ connectionString: "postgresql://postgres:postgres@localhost:5432/placeholder" }),
    });
  }

  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
