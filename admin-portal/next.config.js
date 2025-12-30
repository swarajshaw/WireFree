/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', '127.0.0.1', 'maps.googleapis.com', 'api.mapbox.com'],
  },
  env: {
    PORT: 6001,
  },
};

module.exports = nextConfig;
