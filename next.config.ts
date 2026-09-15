import type { NextConfig } from "next";

const cors = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ["cheerio", "@react-pdf/renderer", "stripe"],
  images: {
    qualities: [75],
  },
  async redirects() {
    return [
      { source: "/projekt/hubbert", destination: "/projekt/hubberty", permanent: true },
      { source: "/projekt/stampe", destination: "/projekt/hubrix", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: cors },
      {
        source: "/api/analys/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

export default nextConfig;
