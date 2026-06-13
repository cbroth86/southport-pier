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
        <label htmlFor="imageFile">Upload a photograph <span className={styles.optional}>(optional)</span></label>
        <input id="imageFile" name="imageFile" type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          className={styles.fileInput}
          aria-describedby="hint-file"
          aria-invalid={!!errors.imageFile}
        />
        <span id="hint-file" className={styles.hint}>
          Choose a photo from your device (JPEG, PNG, WebP or AVIF, up to 8&nbsp;MB).
        </span>
        {errors.imageFile ? <span className={styles.error}>{errors.imageFile}</span> : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="imageURL">
          Photograph URL <span className={styles.optional}>(optional)</span>{" "}
          <span
            className={styles.tip}
            tabIndex={0}
            role="note"
            aria-label="Only needed if your photo is already online. Open the image on a site such as Facebook, right-click (or press and hold on mobile) and choose “Copy image address”, then paste the link here. If you have the photo on your device, use the upload option above instead."
            title="Only needed if your photo is already online. Open the image on a site such as Facebook, right-click (or press and hold on mobile) and choose “Copy image address”, then paste the link here. If you have the photo on your device, use the upload option above instead."
          >
            ?
          </span>
        </label>
        <input id="imageURL" name="imageURL" type="url" inputMode="url"
          placeholder="https://…" aria-describedby="hint-image" />
        <span id="hint-image" className={styles.hint}>
          Already have the photo online? Paste its direct link. Otherwise use the upload
          option above.
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
