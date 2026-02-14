/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: ['images.unsplash.com', 'localhost'],
    },
};

module.exports = nextConfig;
