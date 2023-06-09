/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.intra.42.fr",
        port: "",
      },
    ],
  },
};

const dotenv = require("dotenv");
const path = require("path");

const resolvedPath = path.resolve(__dirname, "..", ".env");
dotenv.config({
  path: resolvedPath,
});
module.exports = nextConfig;
