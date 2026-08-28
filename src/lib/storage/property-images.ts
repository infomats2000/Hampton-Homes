import "server-only";

import { Storage } from "@google-cloud/storage";

export const PROPERTY_IMAGE_BUCKET = process.env.PROPERTY_IMAGE_BUCKET ?? "infomats-realestate-property-images";
export const propertyImageBucket = new Storage().bucket(PROPERTY_IMAGE_BUCKET);

export function publicPropertyImageUrl(objectName: string) {
  const encodedName = objectName.split("/").map(encodeURIComponent).join("/");
  return `https://storage.googleapis.com/${PROPERTY_IMAGE_BUCKET}/${encodedName}`;
}

export function objectNameFromPublicUrl(urlValue: string): string | null {
  try {
    const url = new URL(urlValue);
    if (url.protocol !== "https:" || url.hostname !== "storage.googleapis.com") return null;
    const prefix = `/${PROPERTY_IMAGE_BUCKET}/`;
    if (!url.pathname.startsWith(prefix)) return null;
    const objectName = decodeURIComponent(url.pathname.slice(prefix.length));
    return objectName.startsWith("properties/") && !objectName.includes("..") ? objectName : null;
  } catch { return null; }
}
