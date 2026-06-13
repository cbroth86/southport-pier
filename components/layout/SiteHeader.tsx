import Link from "next/link";
import styles from "./SiteHeader.module.css";

const NAV = [
  { href: "/history", label: "History" },
  { href: "/memories", label: "Memories" },
  { href: "/friends", label: "Friends" },
  { href: "/mural", label: "Mural" },
  { href: "/about", label: "About" },
];

/**
 * Server Component. The mobile disclosure is CSS-only (a native <details> element)
 * so the header ships ZERO client JavaScript.
 */
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>Southport Pier</span>
          <span className={styles.brandSub}>Community Archive</span>
        </Link>

        <details className={styles.nav}>
          <summary className={styles.toggle} aria-label="Toggle navigation menu">
            <span className={styles.toggleBar} aria-hidden="true" />
            Menu
          </summary>
          <nav aria-label="Primary">
            <ul className={styles.list}>
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
