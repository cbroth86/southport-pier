import "server-only";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

/**
 * Supabase Storage upload pipeline. Derives the CLS-guard primitives
 * (width, height, blurDataURL) at upload time so every <Image> can reserve
 * space and paint a blur placeholder — no layout shift, no client work.
 */

const BUCKET = "pier-media";

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase Storage env vars are not configured.");
  // Service-role client is SERVER-ONLY (this module imports "server-only").
  return createClient(url, key, { auth: { persistSession: false } });
}

export type ImageMetrics = {
  width: number;
  height: number;
  blurDataURL: string;
};

/** Compute width/height and a tiny base64 blur placeholder from raw image bytes. */
export async function deriveImageMetrics(bytes: Buffer): Promise<ImageMetrics> {
  const image = sharp(bytes, { failOn: "none" });
  const meta = await image.metadata();
  const placeholder = await image
    .clone()
    .resize(16, 16, { fit: "inside" })
    .webp({ quality: 40 })
    .toBuffer();

  return {
    width: meta.width ?? 1,
    height: meta.height ?? 1,
    blurDataURL: `data:image/webp;base64,${placeholder.toString("base64")}`,
  };
}

export type StoredUpload = ImageMetrics & { url: string };

/** Upload bytes to Supabase Storage and return public URL + metrics. */
export async function uploadImage(file: File): Promise<StoredUpload> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const metrics = await deriveImageMetrics(bytes);

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${crypto.randomUUID()}.${ext}`;

  const supabase = serviceClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: false });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, ...metrics };
}
