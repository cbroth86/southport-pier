import "server-only";
import type { DirectoryListing } from "@prisma/client";
import { sanitizeBioHTML } from "@/lib/sanitize";

/**
 * Curated fallback for the Friends directory.
 *
 * The canonical records live in the database (see prisma/seed.ts). When no
 * database is reachable — e.g. preview deployments without DATABASE_URL — the
 * data layer falls back to these editorial records so the directory and its
 * profiles still render. Keep these in step with the FOUNDER/curated entries
 * in the seed.
 */

const STAMP = new Date("2026-01-01T00:00:00.000Z");

function curated(
  data: Pick<
    DirectoryListing,
    | "businessName"
    | "slug"
    | "contactName"
    | "description"
    | "bioHTML"
    | "websiteURL"
    | "category"
    | "membershipTier"
    | "isPaid"
  >,
): DirectoryListing {
  return {
    id: `curated-${data.slug}`,
    logoURL: null,
    approvalStatus: "APPROVED",
    approvedById: null,
    createdAt: STAMP,
    updatedAt: STAMP,
    ...data,
    bioHTML: sanitizeBioHTML(data.bioHTML),
  };
}

export const CURATED_LISTINGS: DirectoryListing[] = [
  curated({
    businessName: "Mettle Therapy",
    slug: "mettle-therapy",
    contactName: "Chris Brotherton, Integrative Counsellor",
    description:
      "Men's mental health support and restorative therapy, led by local integrative counsellor Chris Brotherton.",
    bioHTML:
      "<p>Mettle Therapy provides men's mental health support and restorative therapy in Southport, led by local integrative counsellor <strong>Chris Brotherton</strong>.</p><p>As a founding participant in the Friends of Southport Pier ecosystem, Mettle Therapy supports the community archive while offering a steady, confidential space for men navigating difficult seasons of life.</p>",
    websiteURL: "https://mettletherapy.co.uk",
    category: "MIND_WELLBEING",
    membershipTier: "FOUNDER",
    isPaid: false,
  }),
  curated({
    businessName: "Richard Owens",
    slug: "richard-owens",
    contactName: "Richard Owens",
    description:
      "Social impact work across Southport through Compassion Acts and Identity Dads CIC.",
    bioHTML:
      "<p>Richard Owens leads social impact work across Southport, including his contributions to <strong>Compassion Acts</strong> and <strong>Identity Dads CIC</strong>.</p><p>A founding participant in the Friends of Southport Pier ecosystem, his work supports families and individuals through practical community action and fatherhood support.</p>",
    websiteURL: "https://compassionacts.uk",
    category: "COMMUNITY_ACTION",
    membershipTier: "FOUNDER",
    isPaid: false,
  }),
  curated({
    businessName: "Ribble Coast Joinery",
    slug: "ribble-coast-joinery",
    contactName: "A. Hartley",
    description:
      "Heritage joinery and timber restoration, rooted in Southport since 1998.",
    bioHTML:
      "<p>Independent heritage joiners specialising in timber restoration.</p>",
    websiteURL: "https://example.com/ribble-coast-joinery",
    category: "LOCAL_TRADE",
    membershipTier: "PAID_DIRECTORY",
    isPaid: true,
  }),
];

export function findCuratedListing(slug: string): DirectoryListing | null {
  return CURATED_LISTINGS.find((l) => l.slug === slug) ?? null;
}
