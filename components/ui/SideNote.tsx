import styles from "./ui.module.css";

/** Contextual marginal note set on warm paper — a quiet aside beside the main text. */
export function SideNote({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <aside className={styles.sideNote}>
      {title ? <p className={styles.sideNoteTitle}>{title}</p> : null}
      <div className={styles.sideNoteBody}>{children}</div>
    </aside>
  );
}
