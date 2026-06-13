import "server-only";
import { unstable_cache } from "next/cache";
import type { DirectoryCategory } from "@prisma/client";
import { prisma } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/revalidate";
import { CURATED_LISTINGS, findCuratedListing } from "@/lib/content/curated-listings";

/** No database configured (e.g. preview deploys) → serve the curated fallback. */
function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/**
 * Public read: APPROVED listings. Cached and tagged 'directory:listings'.
 * FOUNDER tier first (civic partners lead), then by category for stable grouping.
 * Uses the @@index([category, membershipTier]) compound index.
 *
 * When no database is reachable (e.g. preview deploys without DATABASE_URL) the
 * curated fallback in lib/content/curated-listings is served instead, so the
 * directory still renders.
 */
export const getApprovedListings = unstable_cache(
  async () => {
    if (!hasDatabase()) return CURATED_LISTINGS;
    try {
      return await prisma.directoryListing.findMany({
        where: { approvalStatus: "APPROVED" },
        orderBy: [{ membershipTier: "asc" }, { category: "asc" }, { businessName: "asc" }],
      });
    } catch {
      return CURATED_LISTINGS;
    }
  },
  ["directory:listings:list"],
  { tags: [CACHE_TAGS.directory], revalidate: 3600 },
);

export const getListingBySlug = unstable_cache(
  async (slug: string) => {
    if (!hasDatabase()) return findCuratedListing(slug);
    try {
      return await prisma.directoryListing.findFirst({
        where: { slug, approvalStatus: "APPROVED" },
      });
    } catch {
      return findCuratedListing(slug);
    }
  },
  ["directory:listings:slug"],
  { tags: [CACHE_TAGS.directory], revalidate: 3600 },
);

export const getApprovedSlugs = unstable_cache(
  async (): Promise<string[]> => {
    if (!hasDatabase()) return CURATED_LISTINGS.map((l) => l.slug);
    try {
      const rows = await prisma.directoryListing.findMany({
        where: { approvalStatus: "APPROVED" },
        select: { slug: true },
      });
      return rows.map((r) => r.slug);
    } catch {
      return CURATED_LISTINGS.map((l) => l.slug);
    }
  },
  ["directory:listings:slugs"],
  { tags: [CACHE_TAGS.directory], revalidate: 3600 },
);

export function filterByCategory<T extends { category: DirectoryCategory }>(
  listings: T[],
  category: DirectoryCategory | null,
): T[] {
  if (!category) return listings;
  return listings.filter((l) => l.category === category);
}

export async function getPendingListings() {
  return prisma.directoryListing.findMany({
    where: { approvalStatus: "PENDING" },
    orderBy: { createdAt: "asc" },
  });
}
