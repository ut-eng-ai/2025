/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NEXT_PUBLIC_DEPLOY === 'true' ? '/2025' : '',
  assetPrefix: process.env.NEXT_PUBLIC_DEPLOY === 'true' ? '/2025/' : '',
};

module.exports = nextConfig;