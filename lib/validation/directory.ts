import { z } from "zod";

export const directoryCategoryEnum = z.enum([
  "MIND_WELLBEING",
  "COMMUNITY_ACTION",
  "LOCAL_TRADE",
]);

export const directoryApplicationSchema = z.object({
  businessName: z.string().trim().min(2).max(120),
  contactName: z.string().trim().min(2).max(80),
  description: z.string().trim().min(20).max(280),
  bioHTML: z.string().trim().min(20).max(8000),
  websiteURL: z.string().url("A valid website URL is required."),
  logoURL: z.string().url().optional().or(z.literal("")),
  category: directoryCategoryEnum,
  website: z.string().max(0).optional(), // honeypot
});

export type DirectoryApplication = z.infer<typeof directoryApplicationSchema>;

/** Collision-safe slug generator. */
export function toSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
