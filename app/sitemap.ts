import type { MetadataRoute } from "next";
import { getApprovedSlugs } from "@/lib/data/directory";
import { SITE_URL } from "@/lib/seo/jsonld";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = ["", "/history", "/memories", "/friends", "/mural"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  let slugs: string[] = [];
  try {
    slugs = await getApprovedSlugs();
  } catch {
    // DB unavailable at build → emit static routes only; profiles added on next build.
  }
  const profileRoutes = slugs.map((slug) => ({
    url: `${SITE_URL}/friends/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...profileRoutes];
}
