import { NextRequest } from "next/server";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
}

const buckets = new Map<string, RateLimitEntry>();
const MAX_BUCKETS = 10_000;

function getClientAddress(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

export function checkRateLimit(
  request: NextRequest,
  scope: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const key = `${scope}:${getClientAddress(request)}`;
  let entry = buckets.get(key);

  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowMs };
  }

  entry.count += 1;
  buckets.set(key, entry);

  if (buckets.size > MAX_BUCKETS) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    }
  }

  return {
    allowed: entry.count <= limit,
    limit,
    remaining: Math.max(0, limit - entry.count),
    retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}
