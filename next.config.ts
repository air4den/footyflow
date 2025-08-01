import type { NextConfig } from "next";

const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client'],
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (isServer) {
      config.externals.push('@prisma/client');
      config.plugins = [...config.plugins, new PrismaPlugin()];
    } else {
      // Client-side configuration for html2canvas
      // Ensure html2canvas is bundled for mobile
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        canvas: false,
        'canvas-prebuilt': false,
      };
      
      // Ensure html2canvas is not externalized on client
      if (config.externals) {
        config.externals = config.externals.filter((external: any) => {
          if (typeof external === 'function') {
            return true; // Keep function externals
          }
          return !external.html2canvas; // Remove html2canvas from externals
        });
      }
    }
    
    return config;
  },
  // Ensure html2canvas is included in the bundle
  experimental: {
    optimizePackageImports: ['html2canvas'],
  },
};

export default nextConfig;
