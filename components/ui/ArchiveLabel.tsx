import styles from "./ui.module.css";

/** Small archival index label — evokes a catalogue card, not a pill badge. */
export function ArchiveLabel({ children }: { children: React.ReactNode }) {
  return <span className={styles.archiveLabel}>{children}</span>;
}
