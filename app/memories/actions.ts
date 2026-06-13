"use server";

import { prisma } from "@/lib/db";
import { memorySubmissionSchema } from "@/lib/validation/memory";

export type SubmitState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
};

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

  await prisma.memoryPost.create({
    data: {
      title,
      residentName,
      story,
      imageURL: imageURL || "",
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
