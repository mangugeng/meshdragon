/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  output: 'standalone',
  transpilePackages: ['three'],
  experimental: {
    serverActions: true,
    esmExternals: 'loose'
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    config.resolve.alias = {
      ...config.resolve.alias,
      'three': require.resolve('three')
    };
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
