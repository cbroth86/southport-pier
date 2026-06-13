"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitFeedback, type FeedbackState } from "@/app/feedback/actions";
import styles from "./FeedbackForm.module.css";

const PHOTO_URL_TIP =
  "Open the photograph on the Mural page, then: on a computer, right-click the image and choose “Copy image address”; on a phone or tablet, press and hold the image and choose “Copy image address” (or “Copy link”). Paste that link here so we can find the exact photo.";

const initialState: FeedbackState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={styles.submit} disabled={pending}>
      {pending ? "Sending…" : "Send to the team"}
    </button>
  );
}

/**
 * Client island for visitor feedback: improvement recommendations and concerns,
 * including reports about a specific photograph (pre-filled via props).
 */
export function FeedbackForm({
  initialType = "RECOMMENDATION",
  reference = "",
}: {
  initialType?: "RECOMMENDATION" | "CONCERN" | "PHOTO_CONCERN";
  reference?: string;
}) {
  const [state, formAction] = useActionState(submitFeedback, initialState);
  const [type, setType] = useState(initialType);
  const errors = state.fieldErrors ?? {};
  const isPhotoConcern = type === "PHOTO_CONCERN";

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
        <label htmlFor="type">What would you like to tell us?</label>
        <select
          id="type"
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value as typeof type)}
        >
          <option value="RECOMMENDATION">A recommendation or idea for improvement</option>
          <option value="CONCERN">A concern about the website or project</option>
          <option value="PHOTO_CONCERN">A concern about a photograph</option>
        </select>
      </div>

      {/* Branching field: only shown when the concern is about a photograph. */}
      {isPhotoConcern ? (
        <div className={styles.field}>
          <label htmlFor="reference">
            Link to the photograph{" "}
            <span
              className={styles.tip}
              tabIndex={0}
              role="note"
              aria-label={PHOTO_URL_TIP}
              title={PHOTO_URL_TIP}
            >
              ?
            </span>
          </label>
          <input
            id="reference"
            name="reference"
            type="text"
            inputMode="url"
            defaultValue={reference}
            placeholder="Paste the image link, e.g. https://…"
            aria-describedby="hint-reference"
          />
          <span id="hint-reference" className={styles.hint}>
            Open the photo on the Mural page and copy its image address, then paste it
            here. If you can’t copy the link, just describe the photo in your message
            below.
          </span>
        </div>
      ) : (
        reference ? <input type="hidden" name="reference" value={reference} /> : null
      )}

      <div className={styles.field}>
        <label htmlFor="message">Your message</label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          maxLength={4000}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "err-message" : undefined}
        />
        {errors.message ? (
          <span id="err-message" className={styles.error}>{errors.message}</span>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="contactName">Your name <span className={styles.optional}>(optional)</span></label>
        <input id="contactName" name="contactName" maxLength={80} />
      </div>

      <div className={styles.field}>
        <label htmlFor="contactEmail">
          Email <span className={styles.optional}>(optional)</span>
        </label>
        <input
          id="contactEmail"
          name="contactEmail"
          type="email"
          inputMode="email"
          maxLength={160}
          placeholder="So we can reply if needed"
          aria-invalid={!!errors.contactEmail}
          aria-describedby={errors.contactEmail ? "err-email" : "hint-email"}
        />
        {errors.contactEmail ? (
          <span id="err-email" className={styles.error}>{errors.contactEmail}</span>
        ) : (
          <span id="hint-email" className={styles.hint}>
            Leave blank to stay anonymous — we won’t be able to reply if you do.
          </span>
        )}
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
