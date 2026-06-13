import { TIMELINE } from "@/lib/content/timeline";
import { PullQuote } from "@/components/ui/PullQuote";
import styles from "./Timeline.module.css";

/**
 * Server Component. Staggered editorial timeline. Reveal animation is pure CSS
 * (animation-timeline: view()) with a static fallback and reduced-motion guard —
 * no JavaScript ships for this page.
 */
export function Timeline() {
  return (
    <ol className={styles.timeline}>
      {TIMELINE.map((entry, i) => (
        <li key={entry.title} className={styles.item} data-side={i % 2 === 0 ? "left" : "right"}>
          <div className={styles.marker} aria-hidden="true" />
          <div className={styles.year}>
            <span className={styles.yearNum}>{entry.span ?? entry.year}</span>
            <span className={styles.kicker}>{entry.kicker}</span>
          </div>
          <div className={styles.body}>
            <h3>{entry.title}</h3>
            <p>{entry.body}</p>
            {entry.pullQuote ? <PullQuote>{entry.pullQuote}</PullQuote> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
