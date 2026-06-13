import styles from "./ui.module.css";

/** Intentional editorial pull quote — not a card, not a callout box. */
export function PullQuote({ children, cite }: { children: React.ReactNode; cite?: string }) {
  return (
    <figure className={styles.pullQuote}>
      <blockquote>{children}</blockquote>
      {cite ? <figcaption>{cite}</figcaption> : null}
    </figure>
  );
}
