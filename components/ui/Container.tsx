import styles from "./ui.module.css";

type Width = "default" | "reading" | "wide";

/** Variable-width content column — the backbone of the editorial layout. */
export function Container({
  children,
  width = "default",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  width?: Width;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  return <Tag className={`${styles.container} ${styles[width]}`}>{children}</Tag>;
}
