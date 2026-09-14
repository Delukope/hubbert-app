import type { NextConfig } from "next";

const cors = [
  { key: "Access-Control-Allow-Origin", value: "*" },
  { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
  { key: "Access-Control-Allow-Headers", value: "Content-Type, Accept" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ["cheerio", "@react-pdf/renderer", "stripe"],
  async headers() {
    return [
      { source: "/api/analys", headers: cors },
      { source: "/api/analys/:path*", headers: cors },
    ];
  },
};

export default nextConfig;
