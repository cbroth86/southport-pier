import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ArchiveLabel } from "@/components/ui/ArchiveLabel";

export default function NotFound() {
  return (
    <Container width="reading">
      <div style={{ padding: "var(--space-6) 0" }}>
        <ArchiveLabel>404 · Not in the archive</ArchiveLabel>
        <h1>This page has drifted out with the tide</h1>
        <p style={{ color: "var(--color-muted)", fontSize: "1.2rem" }}>
          The page you were looking for could not be found. It may have been moved, or
          never catalogued here.
        </p>
        <p>
          <Link href="/">Return to the archive →</Link>
        </p>
      </div>
    </Container>
  );
}
