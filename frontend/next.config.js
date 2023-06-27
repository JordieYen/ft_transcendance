/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['cdn.intra.42.fr', 'localhost'],
    },
    // async headers() {
    //     return [
    //       {
    //         source: '/(.*)',
    //         headers: [
    //           {
    //             key: 'Access-Control-Allow-Origin',
    //             value: 'http://localhost:3001',
    //           },
    //           {
    //             key: 'Access-Control-Allow-Methods',
    //             value: 'GET, POST, DELETE, PUT, PATCH',
    //           },
    //           {
    //             key: 'Access-Control-Allow-Credentials',
    //             value: 'true',
    //           },
    //         ],
    //       },
    //     ];
    // },
}

module.exports = nextConfig
