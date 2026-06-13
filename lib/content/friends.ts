/**
 * Editorial copy for the Friends of Southport Pier directory.
 * Founding partners are surfaced as CIVIC PARTNERSHIPS — not affiliate promotions.
 * The records themselves live in the database (membershipTier = FOUNDER); this file
 * holds only the curatorial framing used on /friends.
 */

import type { DirectoryCategory } from "@prisma/client";

export const CATEGORY_META: Record<
  DirectoryCategory,
  { label: string; blurb: string; slug: string }
> = {
  MIND_WELLBEING: {
    label: "Mind & Well-being",
    blurb: "Counsellors, therapists and groups supporting mental health across Southport.",
    slug: "mind-wellbeing",
  },
  COMMUNITY_ACTION: {
    label: "Community & Action",
    blurb: "Charities, CICs and volunteers working for the town and its people.",
    slug: "community-action",
  },
  LOCAL_TRADE: {
    label: "Local Trade",
    blurb: "Trusted independent businesses and makers rooted in the community.",
    slug: "local-trade",
  },
};

export const CATEGORY_BY_SLUG: Record<string, DirectoryCategory> = Object.fromEntries(
  Object.entries(CATEGORY_META).map(([key, meta]) => [meta.slug, key as DirectoryCategory]),
);

export const FRIENDS_CTA = {
  heading: "Become a Friend of Southport Pier",
  body: "Support the archive, preserve local stories, and help residents discover trusted community organisations, practitioners, and local services.",
};

export const ARCHIVE_DISCLAIMER =
  "Memories reflect contributors’ personal recollections and may contain historic inaccuracies.";
