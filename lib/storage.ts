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

// Hardening limits. Re-encoding + a max dimension neutralises EXIF/GPS leakage,
// "polyglot" files (e.g. an image with an appended script payload), and oversized
// uploads that would burn processing time.
const MAX_DIMENSION = 2400;
const WEBP_QUALITY = 82;

export type StoredUpload = ImageMetrics & { url: string };

/**
 * Upload an image to Supabase Storage and return its public URL + CLS metrics.
 *
 * SECURITY: the bytes are fully DECODED and RE-ENCODED to WebP via Sharp. This
 * validates the file is a real image (ignoring the client-supplied MIME type),
 * strips all metadata (including EXIF GPS), drops any trailing non-image payload,
 * and caps the dimensions. The original bytes are never stored or served.
 */
export async function uploadImage(file: File): Promise<StoredUpload> {
  const bytes = Buffer.from(await file.arrayBuffer());

  // Decode + auto-orient. failOn:"error" rejects truncated/corrupt inputs.
  const pipeline = sharp(bytes, { failOn: "error" }).rotate();

  const meta = await pipeline.metadata();
  if (!meta.format || !meta.width || !meta.height) {
    throw new Error("Unsupported or invalid image file.");
  }

  // Re-encode to WebP at a bounded size. Metadata is dropped by default.
  const { data, info } = await pipeline
    .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer({ resolveWithObject: true });

  const placeholder = await sharp(data)
    .resize(16, 16, { fit: "inside" })
    .webp({ quality: 40 })
    .toBuffer();

  const path = `${crypto.randomUUID()}.webp`;
  const supabase = serviceClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, data, { contentType: "image/webp", upsert: false });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return {
    url: pub.publicUrl,
    width: info.width,
    height: info.height,
    blurDataURL: `data:image/webp;base64,${placeholder.toString("base64")}`,
  };
}
