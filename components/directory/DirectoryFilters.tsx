import Link from "next/link";
import { CATEGORY_META } from "@/lib/content/friends";
import styles from "./Directory.module.css";

/**
 * Server Component filter — renders as <Link> tabs driven by searchParams.
 * No client JavaScript: filtering is a navigation, fully accessible and crawlable.
 */
export function DirectoryFilters({ active }: { active: string | null }) {
  const tabs = [
    { slug: null, label: "All Friends" },
    ...Object.values(CATEGORY_META).map((m) => ({ slug: m.slug, label: m.label })),
  ];

  return (
    <nav className={styles.filters} aria-label="Filter directory by category">
      <ul>
        {tabs.map((tab) => {
          const isActive = active === tab.slug || (!active && tab.slug === null);
          return (
            <li key={tab.label}>
              <Link
                href={tab.slug ? `/friends?group=${tab.slug}` : "/friends"}
                className={styles.filterLink}
                aria-current={isActive ? "page" : undefined}
                data-active={isActive ? "true" : undefined}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
