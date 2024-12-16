/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "edamam-product-images.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "www.edamam.com",
      },
      {
        protocol: "https",
        hostname: "ai-trainer-bucket.s3.ap-southeast-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
