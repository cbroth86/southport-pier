import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Southport Pier — Community Archive",
    short_name: "Southport Pier",
    description:
      "An independent community archive for Southport Pier. Not affiliated with Sefton Council.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfbfa",
    theme_color: "#1a2e40",
    lang: "en-GB",
  };
}
