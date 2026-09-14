import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ["cheerio", "@react-pdf/renderer", "stripe"],
};

export default nextConfig;
