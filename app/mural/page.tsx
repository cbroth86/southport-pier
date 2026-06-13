import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Container } from "@/components/ui/Container";
import { ArchiveLabel } from "@/components/ui/ArchiveLabel";
import { getMuralBatch } from "@/lib/data/media";

export const metadata: Metadata = {
  title: "Photographic Mural",
  description:
    "An endless photographic mural of Southport Pier — community photographs, newest first.",
  alternates: { canonical: "/mural" },
};

export const revalidate = 3600;

// Code-split the interactive grid out of the initial bundle.
const MuralGrid = dynamic(() =>
  import("@/components/mural/MuralGrid").then((m) => m.MuralGrid),
);

export default async function MuralPage() {
  const initial = await getMuralBatch(null).catch(() => ({ items: [], nextCursor: null }));

  return (
    <Container>
      <header style={{ paddingTop: "var(--space-5)", maxWidth: "var(--measure)" }}>
        <ArchiveLabel>Community Photobank</ArchiveLabel>
        <h1>The Photographic Mural</h1>
        <p style={{ fontSize: "1.2rem", color: "var(--color-muted)" }}>
          An endless wall of photographs of the pier, contributed by the community and
          shown newest first. Select any image to see it in full, with its credit and year.
        </p>
      </header>

      <MuralGrid initial={{ items: initial.items, nextCursor: initial.nextCursor ? `${initial.nextCursor.createdAt}_${initial.nextCursor.id}` : null }} />
    </Container>
  );
}
