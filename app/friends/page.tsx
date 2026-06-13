import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ArchiveLabel } from "@/components/ui/ArchiveLabel";
import { DirectoryFilters } from "@/components/directory/DirectoryFilters";
import { DirectoryCard } from "@/components/directory/DirectoryCard";
import { FounderProfile } from "@/components/directory/FounderProfile";
import { getApprovedListings } from "@/lib/data/directory";
import { CATEGORY_META, CATEGORY_BY_SLUG, FRIENDS_CTA } from "@/lib/content/friends";
import type { DirectoryCategory } from "@prisma/client";
import dStyles from "@/components/directory/Directory.module.css";
import styles from "./friends.module.css";

export const metadata: Metadata = {
  title: "Friends of Southport Pier",
  description:
    "A curated directory of community well-being organisations, charities and trusted local trades supporting Southport Pier.",
  alternates: { canonical: "/friends" },
};

export const revalidate = 3600;

const ORDER: DirectoryCategory[] = ["MIND_WELLBEING", "COMMUNITY_ACTION", "LOCAL_TRADE"];

export default async function FriendsPage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string }>;
}) {
  const { group } = await searchParams;
  const activeSlug = group && CATEGORY_BY_SLUG[group] ? group : null;
  const activeCategory = activeSlug ? CATEGORY_BY_SLUG[activeSlug] : null;

  const listings = await getApprovedListings().catch(() => []);
  const founders = listings.filter((l) => l.membershipTier === "FOUNDER");
  const visibleCategories = activeCategory ? [activeCategory] : ORDER;

  return (
    <>
      <Container>
        <header className={styles.head}>
          <ArchiveLabel>The Friends Network</ArchiveLabel>
          <h1>Friends of Southport Pier</h1>
          <p className={styles.intro}>
            A curated, membership-supported directory of the people and organisations
            standing alongside the pier — presented as civic partnerships, not
            advertisements.
          </p>
        </header>

        {!activeCategory && founders.length > 0 ? (
          <section aria-labelledby="founders-heading" className={styles.founderSection}>
            <h2 id="founders-heading">Founding Friends</h2>
            <p className={styles.founderNote}>
              Founding community participants within the Friends of Southport Pier
              ecosystem.
            </p>
            <div className={dStyles.founders}>
              {founders.map((f) => (
                <FounderProfile key={f.id} listing={f} />
              ))}
            </div>
          </section>
        ) : null}

        <DirectoryFilters active={activeSlug} />

        {visibleCategories.map((category) => {
          const inCategory = listings.filter((l) => l.category === category);
          if (inCategory.length === 0) return null;
          return (
            <section key={category} className={dStyles.group} aria-labelledby={`grp-${category}`}>
              <div className={dStyles.groupHead}>
                <h2 id={`grp-${category}`}>{CATEGORY_META[category].label}</h2>
                <p className={dStyles.groupBlurb}>{CATEGORY_META[category].blurb}</p>
              </div>
              <div className={dStyles.entries}>
                {inCategory.map((listing) => (
                  <DirectoryCard key={listing.id} listing={listing} />
                ))}
              </div>
            </section>
          );
        })}
      </Container>

      <section className={dStyles.cta} aria-labelledby="cta-heading">
        <div className={dStyles.ctaInner}>
          <h2 id="cta-heading">{FRIENDS_CTA.heading}</h2>
          <p>{FRIENDS_CTA.body}</p>
          <Link href="/friends?group=community-action" className={dStyles.ctaLink}>
            Join the Friends network
          </Link>
        </div>
      </section>
    </>
  );
}
