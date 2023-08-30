// /** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ["cdn.intra.42.fr", "localhost", process.env.NEXT_PUBLIC_HOST],
    },
  };
  
module.exports = nextConfig;
  
