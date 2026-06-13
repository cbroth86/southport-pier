import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/jsonld";

// Shared rule for crawlers we welcome: index public pages and static assets,
// but keep the Next internals, API routes and the admin/moderation area out.
const ALLOWED = {
  allow: ["/", "/_next/static/"],
  disallow: ["/_next/", "/api/", "/admin"],
};

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Search engines + selected AI search/training crawlers we permit.
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "Applebot",
          "Google-Extended",
          "PerplexityBot",
          "OAI-SearchBot",
          "GPTBot",
        ],
        ...ALLOWED,
      },
      // Crawlers we block entirely.
      {
        userAgent: ["CCBot", "GPTBot-User", "Claude-Web", "Meta-ExternalAgent"],
        disallow: "/",
      },
      // Anthropic's crawler.
      {
        userAgent: "ClaudeBot",
        ...ALLOWED,
      },
      // Everything else: no blanket allow, but static assets are fine; internals,
      // API and the admin area stay disallowed.
      {
        userAgent: "*",
        allow: ["/_next/static/"],
        disallow: ["/_next/", "/api/", "/admin"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
