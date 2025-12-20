/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'localhost'],
  },
  eslint: {
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig 