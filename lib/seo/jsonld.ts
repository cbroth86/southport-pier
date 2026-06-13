import type { DirectoryListing } from "@prisma/client";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.southportpier.co.uk";

export const SITE_NAME = "Southport Pier — Community Archive";

/** Root Organization + WebSite graph. Rendered once in the layout. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        description:
          "An independent community archive preserving the heritage, memories and restoration of Southport Pier. Not affiliated with Sefton Council.",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: "en-GB",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "LandmarksOrHistoricalBuildings",
        name: "Southport Pier",
        description: "The second-longest pier in Great Britain and the oldest iron pier, opened 1860.",
        url: `${SITE_URL}/history`,
        geo: { "@type": "GeoCoordinates", latitude: 53.6557, longitude: -3.0156 },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Southport",
          addressRegion: "Merseyside",
          addressCountry: "GB",
        },
      },
    ],
  };
}

/** Per-listing LocalBusiness graph for /friends/[slug]. */
export function listingJsonLd(listing: Pick<DirectoryListing, "businessName" | "description" | "websiteURL" | "slug" | "logoURL">) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: listing.businessName,
    description: listing.description,
    url: listing.websiteURL,
    ...(listing.logoURL ? { image: listing.logoURL } : {}),
    areaServed: { "@type": "City", name: "Southport" },
    mainEntityOfPage: `${SITE_URL}/friends/${listing.slug}`,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
