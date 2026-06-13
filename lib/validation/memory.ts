import { z } from "zod";

// Count URLs/links in a block of text — a cheap, dependency-free spam signal.
function linkCount(text: string): number {
  const matches = text.match(/\b(?:https?:\/\/|www\.)\S+|\b\S+\.(?:com|net|org|io|ru|cn|xyz|info|biz|shop|link)\b/gi);
  return matches ? matches.length : 0;
}

export const memorySubmissionSchema = z.object({
  title: z.string().trim().min(4, "Please give your memory a short title.").max(120),
  residentName: z.string().trim().min(2, "Please tell us who is sharing this.").max(80),
  story: z
    .string()
    .trim()
    .min(40, "Please share a little more detail (at least 40 characters).")
    .max(4000, "Please keep memories under 4,000 characters.")
    // Spam heuristic: genuine memories rarely contain multiple links.
    .refine((s) => linkCount(s) <= 2, {
      message: "Please remove the links from your memory — they aren’t needed here.",
    }),
  // Free-text era/date the memory is about. Permissive on format, light on validation.
  memoryDate: z
    .string()
    .trim()
    .max(40, "Please keep the date short, e.g. “1990” or “March 2020”.")
    .regex(/^[\p{L}0-9 .,/'’-]*$/u, "Please use letters, numbers, spaces, dots or slashes only.")
    .optional()
    .or(z.literal("")),
  imageURL: z
    .string()
    .trim()
    .url("Please enter a valid image link.")
    .startsWith("https://", "Image links must start with https://.")
    .optional()
    .or(z.literal("")),
  imageAlt: z.string().trim().max(160).optional().or(z.literal("")),
  // Honeypot — humans never see it. We accept ANY value here so a filled value
  // (bot or browser autofill) doesn't surface a confusing validation error on a
  // hidden field; the submit action inspects it separately and silently accepts.
  website: z.string().max(2000).optional(),
});

export type MemorySubmission = z.infer<typeof memorySubmissionSchema>;
