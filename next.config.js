/** @type {import('next').NextConfig} */
const nextConfig = {

    async rewrites() {
        return [
          {
            source: '/admin/:path*', // What users see in URL
            destination: "/admin-dashboard/app/:path*", // Where files actually are
          },
        ];
      },
};


module.exports = {
  ...nextConfig,
  images: {
    domains: ["localhost", "admin.protein.tn", "ecommercebackend-production-6915.up.railway.app", "api.qrserver.com"],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '145.223.118.9',
        port: '5000',
        pathname: '/**',
      },
    ],
  },
};
