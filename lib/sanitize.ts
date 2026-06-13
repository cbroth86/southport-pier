import DOMPurify from "isomorphic-dompurify";

/**
 * Allowlist sanitiser for the single HTML sink in the app: DirectoryListing.bioHTML.
 * Always run on WRITE (before persistence) so the database never holds unsafe markup.
 */
export function sanitizeBioHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "ul", "ol", "li", "a", "h3", "blockquote"],
    ALLOWED_ATTR: ["href", "rel", "target"],
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:)/i,
    FORBID_ATTR: ["style", "onerror", "onclick"],
  });
}

/** Collapse whitespace and strip ASCII control characters from short free-text fields. */
export function cleanText(input: string): string {
  const controlChars = new RegExp("[\\x00-\\x1F\\x7F]", "g");
  return input.replace(controlChars, "").replace(/\s+/g, " ").trim();
}
