"use server";

import { prisma } from "@/lib/db";
import { feedbackSchema } from "@/lib/validation/feedback";

export type FeedbackState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
};

/**
 * Public feedback submission. Writes a Feedback row (status = NEW) for a curator
 * to review. Performs NO revalidation — feedback is never shown publicly.
 */
export async function submitFeedback(
  _prev: FeedbackState,
  formData: FormData,
): Promise<FeedbackState> {
  const parsed = feedbackSchema.safeParse({
    type: formData.get("type"),
    message: formData.get("message"),
    contactName: formData.get("contactName") ?? "",
    contactEmail: formData.get("contactEmail") ?? "",
    reference: formData.get("reference") ?? "",
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
    return { ok: true, message: "Thank you — your message has been received." };
  }

  const { type, message, contactName, contactEmail, reference } = parsed.data;

  try {
    await prisma.feedback.create({
      data: {
        type,
        message,
        contactName: contactName || null,
        contactEmail: contactEmail || null,
        reference: reference || null,
        status: "NEW",
      },
    });
  } catch {
    return {
      ok: false,
      message:
        "Sorry — we couldn’t send your message just now. Please try again in a little while.",
    };
  }

  return {
    ok: true,
    message:
      "Thank you. Your message has been received and will be reviewed by a member of the team. Please note this is a community project and is not monitored around the clock — if your concern is urgent or relates to anyone’s safety, please contact the appropriate emergency or local authority service directly.",
  };
}
