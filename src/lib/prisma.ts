import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPostgresAdapter(connectionString: string): PrismaPg {
  const url = new URL(connectionString);

  // DigitalOcean Managed PostgreSQL uses TLS with a managed CA chain. The pg
  // driver otherwise treats sslmode=require as verify-full and rejects it.
  url.searchParams.delete("sslmode");
  url.searchParams.delete("uselibpqcompat");

  return new PrismaPg({
    connectionString: url.toString(),
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
  });
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return new PrismaClient({
      adapter: createPostgresAdapter("postgresql://postgres:postgres@localhost:5432/placeholder"),
    });
  }

  // Cost & Performance Optimized PostgreSQL Pool Configuration:
  // - max: 5 (limits pool connections per serverless container, avoiding connection leaks)
  // - idleTimeoutMillis: 10000 (releases idle connections quickly so Neon can auto-suspend to 0 compute cost)
  // - connectionTimeoutMillis: 5000 (fails fast if network times out)
  const adapter = createPostgresAdapter(connectionString);

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
