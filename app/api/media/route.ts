import { NextResponse } from "next/server";
import { getMuralBatch } from "@/lib/data/media";

// Prisma requires the Node.js runtime.
export const runtime = "nodejs";

/**
 * Mural feed. Keyset pagination, newest-first, batches of 24.
 * GET /api/media                       → first batch
 * GET /api/media?cursor=<ISO>_<id>     → next batch
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("cursor");

  let cursor: { createdAt: string; id: string } | null = null;
  if (raw) {
    const sep = raw.lastIndexOf("_");
    if (sep > 0) {
      cursor = { createdAt: raw.slice(0, sep), id: raw.slice(sep + 1) };
    }
  }

  const { items, nextCursor } = await getMuralBatch(cursor);

  return NextResponse.json(
    {
      items,
      nextCursor: nextCursor ? `${nextCursor.createdAt}_${nextCursor.id}` : null,
    },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}
