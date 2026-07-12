import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NEXT_DIST_DIR lets CI/sandboxed builds write to an alternate directory
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
