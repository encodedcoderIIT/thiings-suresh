import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lftz25oez4aqbxpq.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.thiings.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
