import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ArchiveLabel } from "@/components/ui/ArchiveLabel";
import { SideNote } from "@/components/ui/SideNote";
import { MemoryBoard } from "@/components/memory/MemoryBoard";
import { MemoryForm } from "@/components/memory/MemoryForm";
import { getApprovedMemories } from "@/lib/data/memories";
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

export default async function MemoriesPage() {
  const memories = await getApprovedMemories().catch(() => []);

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
