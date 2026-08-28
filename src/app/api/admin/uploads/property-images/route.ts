import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { objectNameFromPublicUrl, propertyImageBucket, publicPropertyImageUrl } from "@/lib/storage/property-images";

const MAX_BYTES = 10 * 1024 * 1024;
const allowedTypes = new Map([["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"]]);

async function isAdmin() {
  const user = await getCurrentUser();
  return Boolean(user?.roles.some((role) => role === "ADMIN" || role === "SUPER_ADMIN"));
}

function hasValidSignature(bytes: Uint8Array, mimeType: string) {
  if (mimeType === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mimeType === "image/png") return bytes.slice(0, 8).every((value, index) => value === [0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a][index]);
  if (mimeType === "image/webp") return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  return false;
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Select an image to upload" }, { status: 400 });
  const extension = allowedTypes.get(file.type);
  if (!extension) return NextResponse.json({ error: "Only JPEG, PNG and WebP images are supported" }, { status: 400 });
  if (file.size === 0 || file.size > MAX_BYTES) return NextResponse.json({ error: "Images must be smaller than 10 MB" }, { status: 400 });
  const buffer = Buffer.from(await file.arrayBuffer());
  if (!hasValidSignature(buffer, file.type)) return NextResponse.json({ error: "The file content is not a valid image" }, { status: 400 });

  const objectName = `properties/${new Date().getUTCFullYear()}/${randomUUID()}.${extension}`;
  await propertyImageBucket.file(objectName).save(buffer, {
    resumable: false,
    validation: "crc32c",
    metadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" },
  });
  return NextResponse.json({ url: publicPropertyImageUrl(objectName) }, { status: 201 });
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const body = await request.json().catch(() => null) as { url?: string } | null;
  const objectName = body?.url ? objectNameFromPublicUrl(body.url) : null;
  if (!objectName) return NextResponse.json({ error: "Invalid property image URL" }, { status: 400 });
  await propertyImageBucket.file(objectName).delete({ ignoreNotFound: true });
  return NextResponse.json({ deleted: true });
}
