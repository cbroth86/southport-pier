import "server-only";
import { revalidateTag } from "next/cache";

/**
 * Canonical cache tags for public read queries. These strings are the contract
 * shared between the Data Access Layer (lib/data/*) and every revalidation path.
 */
export const CACHE_TAGS = {
  memories: "memories:approved",
  directory: "directory:listings",
  mural: "mural:feed",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

/**
 * Fired the instant an item moves PENDING -> APPROVED (or APPROVED -> REJECTED).
 * Purges all public surfaces so the static cache reflects the new state on the
 * very next request — no waiting for the ISR window.
 */
export function revalidateApproval(): void {
  revalidateTag(CACHE_TAGS.memories);
  revalidateTag(CACHE_TAGS.mural);
  revalidateTag(CACHE_TAGS.directory);
}

/** Allow the secured webhook to revalidate an explicit, known tag only. */
export function isKnownTag(tag: string): tag is CacheTag {
  return (Object.values(CACHE_TAGS) as string[]).includes(tag);
}
