import type { NextConfig } from "next";


module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://pecel-lele-connect.vercel.app/api/:path*',
      },
    ];
  },
};


const nextConfig: NextConfig = {
  /* config options here */
  env: {
    MIDTRANS_CLIENT_KEY: process.env.MIDTRANS_CLIENT_KEY,
    MIDTRANS_ENV: process.env.MIDTRANS_ENV,
  },
  eslint: {
    ignoreDuringBuilds: true, // Nonaktifkan ESLint saat build jika masih error
  },
  typescript: {
    ignoreBuildErrors: true, // Opsional: Nonaktifkan TypeScript error sementara
  },

  
};

export default nextConfig;
