/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['three'],
    webpack: (config) => {
        config.externals.push({
            'utf-8-validate': 'commonjs utf-8-validate',
            'bufferutil': 'commonjs bufferutil',
        })
        return config
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Permissions-Policy',
                        value: 'accelerometer=*, gyroscope=*, magnetometer=*, xr-spatial-tracking=*'
                    }
                ],
            },
        ]
    },
    output: 'standalone'
}

module.exports = nextConfig