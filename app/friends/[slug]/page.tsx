import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { getListingBySlug, getApprovedSlugs } from "@/lib/data/directory";
import { CATEGORY_META } from "@/lib/content/friends";
import { listingJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import styles from "@/components/directory/Profile.module.css";

export const revalidate = 3600;

// Pre-render approved profiles at build; tag 'directory:listings' revalidates on change.
export async function generateStaticParams() {
  try {
    const slugs = await getApprovedSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    // No DB reachable at build time → render profiles on-demand (ISR) instead.
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return { title: "Profile not found" };
  return {
    title: listing.businessName,
    description: listing.description,
    alternates: { canonical: `/friends/${listing.slug}` },
    openGraph: { title: listing.businessName, description: listing.description },
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const isFounder = listing.membershipTier === "FOUNDER";

  return (
    <Container width="reading" as="article">
      <div className={styles.page}>
        <p className={styles.crumb}>
          <Link href="/friends">Friends of Southport Pier</Link> ·{" "}
          {CATEGORY_META[listing.category].label}
        </p>

        <header className={styles.profileHead}>
          <p className={styles.kicker}>
            {isFounder ? "Founding Friend" : "Friend of Southport Pier"}
          </p>
          <h1>{listing.businessName}</h1>
          <p className={styles.contact}>{listing.contactName}</p>
        </header>

        <div
          className={styles.bio}
          // Sanitised on write (lib/sanitize.ts) — allowlisted markup only.
          dangerouslySetInnerHTML={{ __html: listing.bioHTML }}
        />

        <a
          className={styles.visit}
          href={listing.websiteURL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit {listing.businessName} →
        </a>

        <p className={styles.partnership}>
          Listed as a community partnership within the Friends of Southport Pier
          network. An independent community archive. Not affiliated with Sefton Council.
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listingJsonLd(listing)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Friends", path: "/friends" },
              { name: listing.businessName, path: `/friends/${listing.slug}` },
            ]),
          ),
        }}
      />
    </Container>
  );
}
