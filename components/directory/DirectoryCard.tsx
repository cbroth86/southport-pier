import Link from "next/link";
import type { DirectoryListing } from "@prisma/client";
import { CATEGORY_META } from "@/lib/content/friends";
import styles from "./Directory.module.css";

/** A directory entry — editorial list item, not a boxed card. */
export function DirectoryCard({ listing }: { listing: DirectoryListing }) {
  return (
    <article className={styles.entry}>
      <p className={styles.entryCategory}>{CATEGORY_META[listing.category].label}</p>
      <h3 className={styles.entryName}>
        <Link href={`/friends/${listing.slug}`}>{listing.businessName}</Link>
      </h3>
      <p className={styles.entryDesc}>{listing.description}</p>
      <p className={styles.entryMeta}>
        {listing.contactName}
        {" · "}
        <Link href={`/friends/${listing.slug}`}>Read profile</Link>
      </p>
    </article>
  );
}
