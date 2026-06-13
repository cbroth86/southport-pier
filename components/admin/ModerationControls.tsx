"use client";

import { useState, useTransition } from "react";
import styles from "./Moderation.module.css";

type Action = (id: string) => Promise<{ ok: boolean; message: string }>;

/**
 * Client island for the moderation queue. Calls approve/reject Server Actions and
 * reflects the outcome; the action itself performs the on-demand revalidation.
 */
export function ModerationControls({
  id,
  approve,
  reject,
}: {
  id: string;
  approve: Action;
  reject: Action;
}) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState<string | null>(null);

  function run(action: Action) {
    startTransition(async () => {
      const res = await action(id);
      setDone(res.message);
    });
  }

  if (done) return <p className={styles.done} role="status">{done}</p>;

  return (
    <div className={styles.controls}>
      <button type="button" disabled={pending} onClick={() => run(approve)} className={styles.approve}>
        {pending ? "Working…" : "Approve"}
      </button>
      <button type="button" disabled={pending} onClick={() => run(reject)} className={styles.reject}>
        Reject
      </button>
    </div>
  );
}
