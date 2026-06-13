/**
 * Heritage timeline — editorial, immutable content kept as typed data (NOT in the
 * database) so /history renders as fully static output with zero queries.
 */

export type TimelineEntry = {
  year: string;
  span?: string;
  title: string;
  kicker: string;
  body: string;
  pullQuote?: string;
};

export const TIMELINE: readonly TimelineEntry[] = [
  {
    year: "1860",
    title: "The oldest iron pier in the country",
    kicker: "Origins",
    body: "Designed by James Brunlees and opened in August 1860, Southport Pier was the first to be conceived purely as a promenade rather than a landing stage. At 1,108 metres it remains the second-longest pier in Great Britain, a slender iron walkway carrying generations of residents out over the Ribble sands.",
    pullQuote: "A promenade built not for cargo, but for the simple pleasure of walking out to sea.",
  },
  {
    year: "Early",
    span: "Early 2000s",
    title: "Restoration, and the first signs of strain",
    kicker: "Renewal & vulnerability",
    body: "A major restoration at the turn of the millennium saved the structure from demolition and reintroduced the tramway. Yet salt, tide and time are patient adversaries. By the 2010s, surveys were recording the structural vulnerabilities that decades of marine exposure leave in wrought iron and timber decking.",
  },
  {
    year: "Dec",
    span: "December 2022",
    title: "Closed on safety grounds",
    kicker: "Closure",
    body: "In December 2022 the pier was closed to the public after inspections identified deterioration that could no longer be safely managed in piecemeal repairs. For the first time in living memory, the long iron deck stood empty — a pause that galvanised the community around the question of its future.",
    pullQuote: "For the first time in living memory, the long iron deck stood empty.",
  },
  {
    year: "Mar",
    span: "March 2026",
    title: "A £20 million comprehensive restoration",
    kicker: "Restoration",
    body: "March 2026 marks the beginning of an ambitious £20 million comprehensive restoration — repairing the substructure, renewing the deck, and securing the pier for another century of seaside walks. This archive exists to gather the memories and photographs that carry its story forward while the work is done.",
  },
] as const;
