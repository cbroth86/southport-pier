import "server-only";
import { unstable_cache } from "next/cache";
import type { DirectoryCategory } from "@prisma/client";
import { prisma } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/revalidate";

/**
 * Public read: APPROVED listings. Cached and tagged 'directory:listings'.
 * FOUNDER tier first (civic partners lead), then by category for stable grouping.
 * Uses the @@index([category, membershipTier]) compound index.
 */
export const getApprovedListings = unstable_cache(
  async () => {
    return prisma.directoryListing.findMany({
      where: { approvalStatus: "APPROVED" },
      orderBy: [{ membershipTier: "asc" }, { category: "asc" }, { businessName: "asc" }],
    });
  },
  ["directory:listings:list"],
  { tags: [CACHE_TAGS.directory], revalidate: 3600 },
);

export const getListingBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.directoryListing.findFirst({
      where: { slug, approvalStatus: "APPROVED" },
    });
  },
  ["directory:listings:slug"],
  { tags: [CACHE_TAGS.directory], revalidate: 3600 },
);

export const getApprovedSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const rows = await prisma.directoryListing.findMany({
      where: { approvalStatus: "APPROVED" },
      select: { slug: true },
    });
    return rows.map((r) => r.slug);
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
