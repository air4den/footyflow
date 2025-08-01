import type { NextConfig } from "next";

const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client'],
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (isServer) {
      config.externals.push('@prisma/client');
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    
    return config;
  },
  // Always include html2canvas in the bundle
  transpilePackages: ['html2canvas'],
};

export default nextConfig;
