/** @type {import('next').NextConfig} */
const nextConfig = {}

const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(__dirname, '..', '.env')
});

module.exports = nextConfig
