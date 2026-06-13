import Image from "next/image";
import type { ApprovedMemory } from "@/lib/data/memories";
import styles from "./MemoryBoard.module.css";

function formatYear(d: Date) {
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(d);
}

/**
 * Asymmetrical memory wall. Server Component. Items take varying spans so the
 * wall reads as a curated collage rather than a uniform card grid.
 */
export function MemoryBoard({ memories }: { memories: ApprovedMemory[] }) {
  if (memories.length === 0) {
    return (
      <p className={styles.empty}>
        No memories have been published yet. Be the first to share one below.
      </p>
    );
  }

  return (
    <div className={styles.wall}>
      {memories.map((m, i) => {
        const feature = i % 5 === 0;
        return (
          <article
            key={m.id}
            className={styles.entry}
            data-feature={feature ? "true" : undefined}
          >
            {m.imageURL ? (
              <div className={styles.media}>
                <Image
                  src={m.imageURL}
                  alt={m.imageAlt ?? `Photograph shared with the memory “${m.title}”`}
                  width={feature ? 900 : 600}
                  height={feature ? 600 : 450}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  placeholder={m.blurDataURL ? "blur" : "empty"}
                  blurDataURL={m.blurDataURL ?? undefined}
                  loading={i < 3 ? "eager" : "lazy"}
                />
              </div>
            ) : null}
            <div className={styles.text}>
              {m.memoryDate ? <p className={styles.when}>{m.memoryDate}</p> : null}
              <h3>{m.title}</h3>
              <p className={styles.story}>{m.story}</p>
              <p className={styles.byline}>
                {m.residentName} · shared {formatYear(m.createdAt)}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
