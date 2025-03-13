/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  output: 'standalone',
  transpilePackages: ['three'],
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
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

module.exports = withNextIntl(nextConfig);
