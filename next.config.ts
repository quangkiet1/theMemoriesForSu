import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow local images (SVG placeholders) and external if needed
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
