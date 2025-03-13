/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  output: 'standalone',
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
