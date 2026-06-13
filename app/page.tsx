import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ArchiveLabel } from "@/components/ui/ArchiveLabel";
import { PullQuote } from "@/components/ui/PullQuote";
import styles from "./home.module.css";

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <Container>
          <ArchiveLabel>Est. 1860 · Southport, Merseyside</ArchiveLabel>
          <h1 className={styles.title}>
            The oldest iron pier in the country, kept in living memory.
          </h1>
          <p className={styles.lede}>
            An independent community archive gathering the heritage, photographs and
            personal stories of Southport Pier — from its 1860 origins to the
            £20&nbsp;million restoration beginning in March&nbsp;2026.
          </p>
          <div className={styles.actions}>
            <Link href="/history" className={styles.primaryAction}>
              Explore the history
            </Link>
            <Link href="/memories" className={styles.secondaryAction}>
              Share a memory
            </Link>
          </div>
        </Container>
      </section>

      <Container>
        <div className={styles.columns}>
          <div className={styles.lead}>
            <h2>A record kept by the people who walked it</h2>
            <p>
              While the deck is closed for restoration, this archive holds the pier&apos;s
              story in trust: a typeset timeline, a wall of residents&apos; memories, an
              ever-growing photographic mural, and a directory of the community
              organisations working alongside it.
            </p>
            <PullQuote cite="Friends of Southport Pier">
              A promenade built not for cargo, but for the simple pleasure of walking
              out to sea.
            </PullQuote>
          </div>

          <ul className={styles.index} aria-label="Sections of the archive">
            <li>
              <Link href="/history"><span>01</span> History &amp; Timeline</Link>
            </li>
            <li>
              <Link href="/memories"><span>02</span> Memory Board</Link>
            </li>
            <li>
              <Link href="/mural"><span>03</span> Photographic Mural</Link>
            </li>
            <li>
              <Link href="/friends"><span>04</span> Friends Directory</Link>
            </li>
          </ul>
        </div>
      </Container>
    </>
  );
}
