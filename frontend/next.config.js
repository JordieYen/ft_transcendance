/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.intra.42.fr", "localhost"],
  },
};

const dotenv = require("dotenv");
const path = require("path");

const resolvedPath = path.resolve(__dirname, "..", ".env");
dotenv.config({
  path: resolvedPath,
});
module.exports = nextConfig;
