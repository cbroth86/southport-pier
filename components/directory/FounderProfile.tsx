import Link from "next/link";
import type { DirectoryListing } from "@prisma/client";
import styles from "./Profile.module.css";

/**
 * Standalone editorial profile for a FOUNDER-tier civic partner. Deliberately
 * distinct from the standard directory entry and framed as a community
 * partnership — never as an affiliate promotion.
 */
export function FounderProfile({ listing }: { listing: DirectoryListing }) {
  return (
    <article className={styles.founder}>
      <div className={styles.founderLabel}>
        <span>Founding Friend</span>
      </div>
      <div className={styles.founderBody}>
        <h3 className={styles.founderName}>{listing.businessName}</h3>
        <p className={styles.founderLead}>{listing.contactName}</p>
        <div
          className={styles.founderBio}
          // Sanitised on write in lib/sanitize.ts (allowlisted tags only).
          dangerouslySetInnerHTML={{ __html: listing.bioHTML }}
        />
        <p className={styles.founderLinks}>
          <Link href={`/friends/${listing.slug}`}>Full profile</Link>
          <a href={listing.websiteURL} target="_blank" rel="noopener noreferrer">
            Visit website
          </a>
        </p>
      </div>
    </article>
  );
}
