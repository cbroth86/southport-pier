import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ArchiveLabel } from "@/components/ui/ArchiveLabel";
import { SideNote } from "@/components/ui/SideNote";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import styles from "./feedback.module.css";

export const metadata: Metadata = {
  title: "Feedback & Concerns",
  description:
    "Share a recommendation to improve the Southport Pier community archive, or report a concern — including about a photograph on the site.",
  alternates: { canonical: "/feedback" },
};

// The form is a client island; the page itself needs no database at render time.
export const dynamic = "force-static";

const TYPE_MAP: Record<string, "APPRECIATION" | "RECOMMENDATION" | "CONCERN" | "PHOTO_CONCERN"> = {
  appreciation: "APPRECIATION",
  recommendation: "RECOMMENDATION",
  concern: "CONCERN",
  photo: "PHOTO_CONCERN",
};

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; ref?: string }>;
}) {
  const { type, ref } = await searchParams;
  const initialType = (type && TYPE_MAP[type]) || "RECOMMENDATION";

  return (
    <>
      <Container width="reading">
        <header className={styles.head}>
          <ArchiveLabel>We’d love to hear from you</ArchiveLabel>
          <h1>Feedback &amp; concerns</h1>
          <p className={styles.intro}>
            This archive is built for the people of Southport and it keeps evolving with
            your help. Use the form below to share your appreciation, suggest an
            improvement, or raise a concern — including about a photograph that appears on
            the site.
          </p>
          <SideNote title="Please note">
            <p>
              Southport Pier is a volunteer-run community project and is{" "}
              <strong>not monitored around the clock</strong>. We read every message and
              will respond as soon as we reasonably can, but we cannot promise an immediate
              reply. If your concern is urgent, relates to anyone’s safety, or needs an
              official response, please contact the appropriate emergency service or local
              authority directly.
            </p>
          </SideNote>
        </header>

        {initialType === "PHOTO_CONCERN" && ref ? (
          <p className={styles.refNote}>
            You’re reporting a concern about a specific photograph. Reference:{" "}
            <code>{ref}</code>
          </p>
        ) : null}

        <FeedbackForm initialType={initialType} reference={ref ?? ""} />
      </Container>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Feedback & Concerns", path: "/feedback" },
            ]),
          ),
        }}
      />
    </>
  );
}
