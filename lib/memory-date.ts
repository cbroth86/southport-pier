/**
 * Helpers for the free-text "memory date" field. We keep the human text as-is
 * but derive a sortable year so the public Memory Board can offer decade filters.
 */

// Matches a plausible 4-digit year from the pier's era onwards (1800–2099).
const YEAR_RE = /\b(18\d{2}|19\d{2}|20\d{2})\b/g;

/**
 * Pull a year out of free text like "1990", "March 2020", "Summer 1985" or
 * "01/01/2022". If several appear, the most recent plausible year wins (memories
 * sometimes mention an earlier reference date). Returns null when none is found.
 */
export function deriveMemoryYear(input: string | null | undefined): number | null {
  if (!input) return null;
  const matches = input.match(YEAR_RE);
  if (!matches) return null;
  const now = new Date().getFullYear();
  const years = matches
    .map((m) => Number(m))
    .filter((y) => y >= 1800 && y <= now + 1);
  if (years.length === 0) return null;
  return Math.max(...years);
}

/** The decade a year falls in, e.g. 1987 → 1980. */
export function decadeOf(year: number): number {
  return Math.floor(year / 10) * 10;
}

/** Human label for a decade start, e.g. 1980 → "1980s". */
export function decadeLabel(decade: number): string {
  return `${decade}s`;
}
