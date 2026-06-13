import "server-only";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/revalidate";

export const MURAL_BATCH = 24;

export type MuralItem = {
  id: string;
  url: string;
  blurDataURL: string | null;
  width: number;
  height: number;
  alt: string | null;
  credit: string | null;
  yearTaken: number | null;
  description: string | null;
  createdAt: string; // ISO — serialisable cursor
};

type Cursor = { createdAt: string; id: string } | null;

/**
 * Keyset (seek) pagination for the mural — newest-first, stable on (createdAt, id).
 * Cached/tagged 'mural:feed'; uses the @@index([createdAt, id]) index.
 */
export const getMuralBatch = unstable_cache(
  async (cursor: Cursor): Promise<{ items: MuralItem[]; nextCursor: Cursor }> => {
    const rows = await prisma.uploadedMedia.findMany({
      take: MURAL_BATCH + 1, // fetch one extra to detect "has more"
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      ...(cursor
        ? {
            where: {
              OR: [
                { createdAt: { lt: new Date(cursor.createdAt) } },
                { createdAt: new Date(cursor.createdAt), id: { lt: cursor.id } },
              ],
            },
          }
        : {}),
    });

    const hasMore = rows.length > MURAL_BATCH;
    const page = hasMore ? rows.slice(0, MURAL_BATCH) : rows;
    const last = page.at(-1);

    return {
      items: page.map((m) => ({
        id: m.id,
        url: m.url,
        blurDataURL: m.blurDataURL,
        width: m.width,
        height: m.height,
        alt: m.alt,
        credit: m.credit,
        yearTaken: m.yearTaken,
        description: m.description,
        createdAt: m.createdAt.toISOString(),
      })),
      nextCursor: hasMore && last ? { createdAt: last.createdAt.toISOString(), id: last.id } : null,
    };
  },
  ["mural:feed:batch"],
  { tags: [CACHE_TAGS.mural], revalidate: 3600 },
);
