import { z } from "zod";

/** Public feedback: improvement recommendations or concerns (incl. photo reports). */
export const feedbackSchema = z.object({
  type: z.enum(["APPRECIATION", "RECOMMENDATION", "CONCERN", "PHOTO_CONCERN"]),
  message: z
    .string()
    .trim()
    .min(10, "Please add a little more detail (at least 10 characters).")
    .max(4000, "Please keep your message under 4,000 characters."),
  contactName: z.string().trim().max(80).optional().or(z.literal("")),
  contactEmail: z
    .string()
    .trim()
    .email("Please enter a valid email address, or leave it blank.")
    .max(160)
    .optional()
    .or(z.literal("")),
  // Reference to a reported photo (id or URL); only meaningful for PHOTO_CONCERN.
  reference: z.string().trim().max(512).optional().or(z.literal("")),
  // Honeypot — must remain empty. Bots fill it; humans never see it.
  website: z.string().max(0).optional(),
});

export type FeedbackSubmission = z.infer<typeof feedbackSchema>;
