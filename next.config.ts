import type { NextConfig } from "next";

const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8001/api/:path*', // Your API server
            },
        ];
    },

    // Optional: Configure headers to pass through
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    {
                        key: 'X-Forwarded-Host',
                        value: 'localhost:3000', // Your NextJS host
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
