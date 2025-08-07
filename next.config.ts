import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  // Enable experimental features for subdomain handling
  experimental: {
    // This allows us to handle dynamic subdomains
  },
  // Custom headers and redirects for subdomain handling
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
