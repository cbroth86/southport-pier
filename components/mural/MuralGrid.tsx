"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { MuralItem } from "@/lib/data/media";
import { Lightbox } from "./Lightbox";
import styles from "./Mural.module.css";

type Feed = { items: MuralItem[]; nextCursor: string | null };

/**
 * Client island. Infinite masonry mural fed by /api/media. An IntersectionObserver
 * watches a sentinel with a 600px root margin and fetches the next batch of 24.
 * CLS is prevented by the stored width/height + blurDataURL on every image.
 */
export function MuralGrid({ initial }: { initial: Feed }) {
  const [items, setItems] = useState<MuralItem[]>(initial.items);
  const [cursor, setCursor] = useState<string | null>(initial.nextCursor);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<MuralItem | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef(cursor);
  cursorRef.current = cursor;

  const loadMore = useCallback(async () => {
    if (loading || cursorRef.current === null) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/media?cursor=${encodeURIComponent(cursorRef.current)}`);
      if (!res.ok) return;
      const next: Feed = await res.json();
      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...next.items.filter((i) => !seen.has(i.id))];
      });
      setCursor(next.nextCursor);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <div className={styles.grid}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={styles.cell}
            style={{ aspectRatio: `${item.width} / ${item.height}` }}
            onClick={() => setActive(item)}
            aria-label={`View photograph: ${item.alt ?? item.description ?? "Southport Pier"}`}
          >
            <Image
              src={item.url}
              alt={item.alt ?? item.description ?? "Photograph of Southport Pier"}
              width={item.width}
              height={item.height}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              placeholder={item.blurDataURL ? "blur" : "empty"}
              blurDataURL={item.blurDataURL ?? undefined}
              loading="lazy"
            />
          </button>
        ))}
      </div>

      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
      <p className={styles.status} role="status" aria-live="polite">
        {loading ? "Loading more photographs…" : cursor === null ? "You’ve reached the end of the mural." : ""}
      </p>

      {active ? <Lightbox item={active} onClose={() => setActive(null)} /> : null}
    </>
  );
}
