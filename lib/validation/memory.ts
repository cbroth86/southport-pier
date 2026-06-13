import { z } from "zod";

export const memorySubmissionSchema = z.object({
  title: z.string().trim().min(4, "Please give your memory a short title.").max(120),
  residentName: z.string().trim().min(2, "Please tell us who is sharing this.").max(80),
  story: z
    .string()
    .trim()
    .min(40, "Please share a little more detail (at least 40 characters).")
    .max(4000, "Please keep memories under 4,000 characters."),
  imageURL: z.string().url("A valid image URL is required.").optional().or(z.literal("")),
  imageAlt: z.string().trim().max(160).optional().or(z.literal("")),
  // Honeypot — must remain empty. Bots fill it; humans never see it.
  website: z.string().max(0).optional(),
});

export type MemorySubmission = z.infer<typeof memorySubmissionSchema>;
