"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitMemory, type SubmitState } from "@/app/memories/actions";
import styles from "./MemoryForm.module.css";

const initialState: SubmitState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={styles.submit} disabled={pending}>
      {pending ? "Sending…" : "Submit your memory"}
    </button>
  );
}

/**
 * Client island. The only interactive component on the Memory Board: validation
 * feedback, pending state, and a success message. Posts to the submitMemory action.
 */
export function MemoryForm() {
  const [state, formAction] = useActionState(submitMemory, initialState);
  const errors = state.fieldErrors ?? {};

  if (state.ok && state.message) {
    return (
      <div className={styles.success} role="status">
        <p>{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className={styles.form} noValidate>
      {state.message && !state.ok ? (
        <p className={styles.formError} role="alert">
          {state.message}
        </p>
      ) : null}

      <div className={styles.field}>
        <label htmlFor="title">Memory title</label>
        <input id="title" name="title" required maxLength={120}
          aria-invalid={!!errors.title} aria-describedby={errors.title ? "err-title" : undefined} />
        {errors.title ? <span id="err-title" className={styles.error}>{errors.title}</span> : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="residentName">Your name</label>
        <input id="residentName" name="residentName" required maxLength={80}
          aria-invalid={!!errors.residentName} aria-describedby={errors.residentName ? "err-name" : undefined} />
        {errors.residentName ? <span id="err-name" className={styles.error}>{errors.residentName}</span> : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="story">Your memory</label>
        <textarea id="story" name="story" rows={6} required maxLength={4000}
          aria-invalid={!!errors.story} aria-describedby={errors.story ? "err-story" : undefined} />
        {errors.story ? <span id="err-story" className={styles.error}>{errors.story}</span> : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="imageURL">Photograph URL <span className={styles.optional}>(optional)</span></label>
        <input id="imageURL" name="imageURL" type="url" inputMode="url"
          placeholder="https://…" aria-describedby="hint-image" />
        <span id="hint-image" className={styles.hint}>
          Paste a link to a photograph to accompany your memory.
        </span>
      </div>

      <div className={styles.field}>
        <label htmlFor="imageAlt">Photograph description <span className={styles.optional}>(optional)</span></label>
        <input id="imageAlt" name="imageAlt" maxLength={160}
          placeholder="Describe the photo for screen-reader users" />
      </div>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <SubmitButton />
    </form>
  );
}
