import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/id/editor',
        destination: '/editor',
        permanent: true,
      },
      {
        source: '/en/editor',
        destination: '/editor',
        permanent: true,
      }
    ]
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react', 'three'],
  },
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
};

export default withNextIntl(nextConfig);
