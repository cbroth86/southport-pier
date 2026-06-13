import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { getPendingMemories } from "@/lib/data/memories";
import { getPendingListings } from "@/lib/data/directory";
import { getCurrentAdmin } from "@/lib/auth";
import { CATEGORY_META } from "@/lib/content/friends";
import { ModerationControls } from "@/components/admin/ModerationControls";
import { approveMemory, rejectMemory, approveListing, rejectListing } from "./actions";
import styles from "./admin.module.css";

export const metadata: Metadata = { title: "Moderation", robots: { index: false, follow: false } };

// Always reflect live queue state — never cached.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return (
      <Container width="reading">
        <p className={styles.locked}>
          No administrator session. Seed an ADMIN user (npm run seed) to access moderation.
        </p>
      </Container>
    );
  }

  const [memories, listings] = await Promise.all([getPendingMemories(), getPendingListings()]);

  return (
    <Container>
      <header className={styles.head}>
        <h1>Moderation queue</h1>
        <p className={styles.who}>Signed in as {admin.email}</p>
      </header>

      <section className={styles.section} aria-labelledby="pm">
        <h2 id="pm">Pending memories ({memories.length})</h2>
        {memories.length === 0 ? (
          <p className={styles.empty}>Nothing awaiting review.</p>
        ) : (
          <ul className={styles.queue}>
            {memories.map((m) => (
              <li key={m.id} className={styles.row}>
                <h3>{m.title}</h3>
                <p className={styles.meta}>{m.residentName}</p>
                <p>{m.story}</p>
                <ModerationControls id={m.id} approve={approveMemory} reject={rejectMemory} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.section} aria-labelledby="pl">
        <h2 id="pl">Pending listings ({listings.length})</h2>
        {listings.length === 0 ? (
          <p className={styles.empty}>Nothing awaiting review.</p>
        ) : (
          <ul className={styles.queue}>
            {listings.map((l) => (
              <li key={l.id} className={styles.row}>
                <h3>{l.businessName}</h3>
                <p className={styles.meta}>
                  {CATEGORY_META[l.category].label} · {l.contactName}
                </p>
                <p>{l.description}</p>
                <ModerationControls id={l.id} approve={approveListing} reject={rejectListing} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </Container>
  );
}
