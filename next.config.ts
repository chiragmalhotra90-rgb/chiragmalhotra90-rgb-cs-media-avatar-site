import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Vercel-native build (no standalone self-host output, so previews serve). */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: ["*.space-z.ai"],
};

export default nextConfig;
