import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    if (process.env.NODE_ENV !== "production") {
      const backendUrl = process.env.BACKEND_URL || "https://backend.test";

      return [
        {
          source: "/api/:path*",
          destination: `${backendUrl}/api/:path*`,
        },
      ];
    }

    return [];
  },
};

export default nextConfig;
