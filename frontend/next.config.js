/** @type {import('next').NextConfig} */
const nextConfig = {}

const dotenv = require('dotenv');
const path = require('path');

const resolvedPath = path.resolve(__dirname, '..', '.env');
dotenv.config({
    path: resolvedPath
});
console.log('dotenv path:', resolvedPath);

module.exports = nextConfig
