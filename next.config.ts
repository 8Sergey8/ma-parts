import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["xlsx"],
  // Preview and desktop tunnels send a different Origin than 127.0.0.1.
  // Without this list, Next.js dev blocks /_next CSS and JS (403).
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "0.0.0.0",
    "null",
    "*.*.*.*",
    "cursor.com",
    "*.cursor.com",
    "**.cursor.com",
    "cursor.sh",
    "*.cursor.sh",
    "**.cursor.sh",
  ],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
