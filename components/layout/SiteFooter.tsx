import Link from "next/link";
import styles from "./SiteFooter.module.css";

/**
 * Persistent footer rendered on every route. Contains the EXACT legal disclaimer
 * required by the brief — do not alter the wording.
 */
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.cols}>
          <div>
            <p className={styles.brand}>Southport Pier</p>
            <p className={styles.tagline}>
              Preserving the heritage, memories and restoration of the oldest iron pier
              in the country.
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className={styles.links}>
              <li><Link href="/history">History &amp; Timeline</Link></li>
              <li><Link href="/memories">Memory Board</Link></li>
              <li><Link href="/friends">Friends Directory</Link></li>
              <li><Link href="/mural">Photographic Mural</Link></li>
            </ul>
          </nav>
        </div>

        <p className={styles.custodian}>
          Custodian &amp; owner: Chris Brotherton,{" "}
          <a
            href="https://mettletherapy.co.uk"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mettle Therapy
          </a>{" "}
          (mettletherapy.co.uk).
        </p>

        <p className={styles.disclaimer}>
          An independent community archive. Not affiliated with Sefton Council.
        </p>
      </div>
    </footer>
  );
}
