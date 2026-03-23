import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
    ],
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
}

export default nextConfig