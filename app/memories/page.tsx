import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ArchiveLabel } from "@/components/ui/ArchiveLabel";
import { SideNote } from "@/components/ui/SideNote";
import { MemoryBoard } from "@/components/memory/MemoryBoard";
import { MemoryForm } from "@/components/memory/MemoryForm";
import { getApprovedMemories } from "@/lib/data/memories";
import { decadeOf, decadeLabel } from "@/lib/memory-date";
import { ARCHIVE_DISCLAIMER } from "@/lib/content/friends";
import styles from "./memories.module.css";

export const metadata: Metadata = {
  title: "Memory Board",
  description:
    "Residents’ memories of Southport Pier. Read approved recollections and share your own for the community archive.",
  alternates: { canonical: "/memories" },
};

// ISR backstop; on-demand revalidation (tag 'memories:approved') keeps it instant.
export const revalidate = 3600;

export default async function MemoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ decade?: string }>;
}) {
  const { decade } = await searchParams;
  const all = await getApprovedMemories().catch(() => []);

  // Auto-generate decade categories from the years actually present in the data.
  const decades = Array.from(
    new Set(all.filter((m) => m.memoryYear != null).map((m) => decadeOf(m.memoryYear!))),
  ).sort((a, b) => a - b);

  const activeDecade = decade && /^\d{4}$/.test(decade) ? Number(decade) : null;

  let memories = all;
  if (activeDecade != null) {
    memories = all
      .filter((m) => m.memoryYear != null && decadeOf(m.memoryYear) === activeDecade)
      // Within a decade, browse chronologically by the memory's own year.
      .sort((a, b) => (a.memoryYear ?? 0) - (b.memoryYear ?? 0));
  }

  return (
    <Container>
      <header className={styles.head}>
        <ArchiveLabel>Community Memory Collection</ArchiveLabel>
        <h1>Memory Board</h1>
        <p className={styles.intro}>
          A wall of recollections from the people who knew the pier best — first walks,
          end-of-pier shows, fishing off the rail, and quiet evenings over the sands.
        </p>
        <SideNote title="A note on the archive">
          <p>{ARCHIVE_DISCLAIMER}</p>
        </SideNote>
      </header>

      {decades.length > 0 ? (
        <nav className={styles.filters} aria-label="Filter memories by decade">
          <span className={styles.filtersLabel}>Browse by era:</span>
          <Link
            href="/memories"
            className={`${styles.chip} ${activeDecade == null ? styles.chipActive : ""}`}
            aria-current={activeDecade == null ? "page" : undefined}
          >
            All
          </Link>
          {decades.map((d) => (
            <Link
              key={d}
              href={`/memories?decade=${d}`}
              className={`${styles.chip} ${activeDecade === d ? styles.chipActive : ""}`}
              aria-current={activeDecade === d ? "page" : undefined}
            >
              {decadeLabel(d)}
            </Link>
          ))}
        </nav>
      ) : null}

      <MemoryBoard memories={memories} />

      <section className={styles.submit} aria-labelledby="share-heading">
        <h2 id="share-heading">Share a memory</h2>
        <p className={styles.submitIntro}>
          Submissions are reviewed by a curator before they appear. New memories are held
          as pending until approved.
        </p>
        <MemoryForm />
      </section>
    </Container>
  );
}
