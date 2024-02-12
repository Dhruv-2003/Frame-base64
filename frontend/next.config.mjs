/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "http://localhost:3000",
      },
    ],
  },
};

export default nextConfig;
