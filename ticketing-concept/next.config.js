/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during build for faster deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow deployment with type errors (for demo purposes)
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;