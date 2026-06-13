import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ArchiveLabel } from "@/components/ui/ArchiveLabel";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "About this Project",
  description:
    "Southport Pier is an evolving community archive — a living, growing project built for the benefit of the Southport community, past, present and future.",
  alternates: { canonical: "/about" },
};

// Fully static — editorial copy, no database queries.
export const dynamic = "force-static";

export default function AboutPage() {
  return (
    <>
      <Container width="reading" as="article">
        <header style={{ paddingTop: "var(--space-5)" }}>
          <ArchiveLabel>About this Project</ArchiveLabel>
          <h1>A living archive for the Southport community</h1>
          <p
            style={{
              fontSize: "1.25rem",
              color: "var(--color-muted)",
              maxWidth: "var(--measure-narrow)",
            }}
          >
            This website is for the Southport community — past, present and future. It is
            an evolving project, built and given as a gift, to gather and protect the
            stories of the oldest iron pier in the country.
          </p>
        </header>

        <section style={{ marginTop: "var(--space-4)" }}>
          <h2>An evolving project</h2>
          <p>
            Southport Pier is not a finished monument behind glass — it is a living archive
            that grows with the people who care about it. Memories, photographs and local
            histories are added over time by residents, families and visitors, so the
            record of the pier keeps deepening rather than standing still.
          </p>
          <p>
            As the £20&nbsp;million restoration of the pier begins, this archive will evolve
            alongside it: documenting the work, celebrating the milestones, and keeping the
            community close to a structure that has stood over the Ribble sands for more
            than 160 years.
          </p>
        </section>

        <section style={{ marginTop: "var(--space-4)" }}>
          <h2>For the benefit of the community</h2>
          <p>
            Everything here exists for the benefit of Southport. The{" "}
            <Link href="/memories">Memory Board</Link> preserves personal recollections,
            the <Link href="/history">history &amp; timeline</Link> traces the pier from its
            1860 origins, the <Link href="/mural">photographic mural</Link> gathers
            archival images, and the{" "}
            <Link href="/friends">Friends of Southport Pier</Link> directory recognises the
            local people and organisations standing alongside the pier.
          </p>
          <p>
            It is offered freely, as a gift to the town, and it will keep changing as the
            community shapes it. If you have a memory, a photograph or a story to add, you
            are part of how this project continues to grow.
          </p>
        </section>

        <p
          style={{
            marginTop: "var(--space-4)",
            color: "var(--color-muted)",
            fontSize: "var(--text-sm)",
          }}
        >
          This website is for the Southport community past, present and future as a gift by
          Chris Brotherton —{" "}
          <a href="https://mettletherapy.co.uk" target="_blank" rel="noopener noreferrer">
            mettletherapy.co.uk
          </a>
          . An independent community archive. Not affiliated with Sefton Council.
        </p>
      </Container>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "About this Project", path: "/about" },
            ]),
          ),
        }}
      />
    </>
  );
}
