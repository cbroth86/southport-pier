"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { MuralItem } from "@/lib/data/media";
import styles from "./Mural.module.css";

/**
 * Expanded photo view. Uses the native <dialog> element for a free focus trap,
 * Esc-to-close, top-layer rendering and a backdrop — minimal JS, maximal a11y.
 */
export function Lightbox({ item, onClose }: { item: MuralItem; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
      aria-label={item.alt ?? item.description ?? "Photograph of Southport Pier"}
    >
      <div className={styles.dialogInner}>
        <button type="button" className={styles.close} onClick={() => ref.current?.close()}>
          Close
        </button>
        <Image
          src={item.url}
          alt={item.alt ?? item.description ?? "Photograph of Southport Pier"}
          width={item.width}
          height={item.height}
          placeholder={item.blurDataURL ? "blur" : "empty"}
          blurDataURL={item.blurDataURL ?? undefined}
          className={styles.dialogImage}
          sizes="90vw"
        />
        <figcaption className={styles.caption}>
          {item.description ? <p className={styles.captionDesc}>{item.description}</p> : null}
          <p className={styles.captionMeta}>
            {item.credit ? <span>Credit: {item.credit}</span> : null}
            {item.yearTaken ? <span>Year: {item.yearTaken}</span> : null}
          </p>
          <p className={styles.report}>
            <a href={`/feedback?type=photo&ref=${encodeURIComponent(item.id)}`}>
              Report a concern about this photo
            </a>
            <span className={styles.reportNote}>
              This is a volunteer-run project and isn’t monitored around the clock.
            </span>
          </p>
        </figcaption>
      </div>
    </dialog>
  );
}
