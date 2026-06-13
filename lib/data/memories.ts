import "server-only";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/revalidate";

export type ApprovedMemory = {
  id: string;
  title: string;
  story: string;
  imageURL: string;
  imageAlt: string | null;
  blurDataURL: string | null;
  residentName: string;
  memoryDate: string | null;
  createdAt: Date;
};

/**
 * Public read: APPROVED memories, newest-first. Cached and tagged 'memories:approved'.
 * Uses the @@index([approvalStatus, createdAt]) compound index.
 */
export const getApprovedMemories = unstable_cache(
  async (): Promise<ApprovedMemory[]> => {
    return prisma.memoryPost.findMany({
      where: { approvalStatus: "APPROVED" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        story: true,
        imageURL: true,
        imageAlt: true,
        blurDataURL: true,
        residentName: true,
        memoryDate: true,
        createdAt: true,
      },
    });
  },
  ["memories:approved:list"],
  { tags: [CACHE_TAGS.memories], revalidate: 3600 },
);

/** Moderation queue (admin only — never cached). */
export async function getPendingMemories() {
  return prisma.memoryPost.findMany({
    where: { approvalStatus: "PENDING" },
    orderBy: { createdAt: "asc" },
  });
}
