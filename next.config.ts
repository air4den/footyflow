import type { NextConfig } from "next";

const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client'],
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (isServer) {
      config.externals.push('@prisma/client');
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    
    // Ensure html2canvas is properly bundled for production
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
  },
};

export default nextConfig;
