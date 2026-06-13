import type { NextConfig } from "next";

const SUPABASE_HOST = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : "*.supabase.co";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Server Actions body size for image uploads via the moderation pipeline.
    serverActions: { bodySizeLimit: "8mb" },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: SUPABASE_HOST,
        pathname: "/storage/v1/object/public/**",
      },
      // Seed / demo imagery only. Remove for production if not used.
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

const withBundleAnalyzer =
  process.env.ANALYZE === "true"
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("@next/bundle-analyzer")({ enabled: true })
    : (config: NextConfig) => config;

export default withBundleAnalyzer(nextConfig);
