/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Routes this applies to
        source: "/api/(.*)",
        // Headers
        headers: [
          // Allow for specific domains to have access or * for all
          {
            key: "Access-Control-Allow-Origin",
            value: "*.smartaitrainer.com",
          },
          // Allows for specific methods accepted
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          // Allows for specific headers accepted (These are a few standard ones)
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },

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
  // (Optional) Export as a static site
  // See https://nextjs.org/docs/pages/building-your-application/deploying/static-exports#configuration
  // (Optional) Export as a standalone site
  // See https://nextjs.org/docs/pages/api-reference/next-config-js/output#automatically-copying-traced-files
  output: "standalone", // Feel free to modify/remove this option

  // Indicate that these packages should not be bundled by webpack
  experimental: {
    serverComponentsExternalPackages: ["sharp", "onnxruntime-node"],
  },
};

export default nextConfig;
