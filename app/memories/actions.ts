"use server";

import { prisma } from "@/lib/db";
import { memorySubmissionSchema } from "@/lib/validation/memory";
import { uploadImage } from "@/lib/storage";

export type SubmitState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
};

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB — mirrors serverActions.bodySizeLimit.
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif"];

/**
 * Public submission. Writes a MemoryPost with approvalStatus = PENDING (the default).
 * IMPORTANT: this performs NO revalidation — pending memories are not public, so the
 * cached '/memories' page must not change until an admin approves the post.
 */
export async function submitMemory(
  _prev: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  const parsed = memorySubmissionSchema.safeParse({
    title: formData.get("title"),
    residentName: formData.get("residentName"),
    story: formData.get("story"),
    imageURL: formData.get("imageURL") ?? "",
    imageAlt: formData.get("imageAlt") ?? "",
    website: formData.get("website") ?? "", // honeypot
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, message: "Please check the highlighted fields.", fieldErrors };
  }

  // Honeypot tripped → silently accept without writing (don't tip off bots).
  if (parsed.data.website) {
    return { ok: true, message: "Thank you — your memory has been submitted for review." };
  }

  const { title, residentName, story, imageURL, imageAlt } = parsed.data;

  // An uploaded file (if provided) takes precedence over a pasted URL.
  let resolvedImageURL = imageURL || "";
  const file = formData.get("imageFile");
  if (file instanceof File && file.size > 0) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return {
        ok: false,
        message: "Please check the highlighted fields.",
        fieldErrors: { imageFile: "Please upload a JPG/JPEG, PNG, WebP or AVIF image." },
      };
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return {
        ok: false,
        message: "Please check the highlighted fields.",
        fieldErrors: { imageFile: "That image is larger than 8 MB. Please choose a smaller file." },
      };
    }
    try {
      const stored = await uploadImage(file);
      resolvedImageURL = stored.url;
    } catch {
      return {
        ok: false,
        message:
          "Sorry — we couldn’t upload that photograph just now. You can try again, paste a photo URL instead, or submit without an image.",
        fieldErrors: { imageFile: "Upload failed. Please try again or use a photo URL." },
      };
    }
  }

  await prisma.memoryPost.create({
    data: {
      title,
      residentName,
      story,
      imageURL: resolvedImageURL,
      imageAlt: imageAlt || null,
      approvalStatus: "PENDING",
      isApproved: false,
    },
  });

  return {
    ok: true,
    message:
      "Thank you — your memory has been submitted and will appear once a curator has reviewed it.",
  };
}
