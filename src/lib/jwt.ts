const MINIMUM_SECRET_LENGTH = 32;

export function getJwtKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < MINIMUM_SECRET_LENGTH) {
    throw new Error(`JWT_SECRET must be configured with at least ${MINIMUM_SECRET_LENGTH} characters.`);
  }

  return new TextEncoder().encode(secret);
}
