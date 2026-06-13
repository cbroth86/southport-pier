import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { isKnownTag } from "@/lib/revalidate";

export const runtime = "nodejs";

/** Constant-time bearer-token comparison to avoid timing leaks. */
function authorized(request: Request): boolean {
  const secret = process.env.REVALIDATION_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const a = Buffer.from(token);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Secured external revalidation webhook (fallback / integrations).
 *
 *   POST /api/revalidate?tag=memories:approved
 *   POST /api/revalidate?path=/friends/mettle-therapy
 *   Header: Authorization: Bearer <REVALIDATION_SECRET>
 *
 * Only known cache tags are accepted for `tag`; `path` revalidates an explicit route.
 */
export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ revalidated: false, message: "Unauthorised" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");
  const path = searchParams.get("path");

  if (!tag && !path) {
    return NextResponse.json(
      { revalidated: false, message: "Provide a 'tag' or 'path' query parameter." },
      { status: 400 },
    );
  }

  if (tag) {
    if (!isKnownTag(tag)) {
      return NextResponse.json(
        { revalidated: false, message: `Unknown tag: ${tag}` },
        { status: 400 },
      );
    }
    revalidateTag(tag);
  }

  if (path) revalidatePath(path);

  return NextResponse.json({ revalidated: true, tag, path, now: Date.now() });
}
