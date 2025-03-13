import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
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
  }
};

export default withNextIntl(nextConfig);
