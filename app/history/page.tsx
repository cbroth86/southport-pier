import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ArchiveLabel } from "@/components/ui/ArchiveLabel";
import { Timeline } from "@/components/timeline/Timeline";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "History & Timeline",
  description:
    "From its 1860 origins as the oldest iron pier in the country, through the December 2022 safety closure, to the £20 million restoration beginning March 2026.",
  alternates: { canonical: "/history" },
};

// Fully static — content is typed data, no database queries.
export const dynamic = "force-static";

export default function HistoryPage() {
  return (
    <>
      <Container as="article">
        <header style={{ paddingTop: "var(--space-5)" }}>
          <ArchiveLabel>The Pier in Time</ArchiveLabel>
          <h1>A history written in iron and tide</h1>
          <p style={{ fontSize: "1.25rem", color: "var(--color-muted)", maxWidth: "var(--measure-narrow)" }}>
            Southport Pier has stood over the Ribble sands for more than 160 years. This is
            its story — origins, strain, closure, and renewal.
          </p>
        </header>
        <Timeline />
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "History & Timeline", path: "/history" },
            ]),
          ),
        }}
      />
    </>
  );
}
