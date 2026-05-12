/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://giveloop-backend.onrender.com/api/:path*'
      }
    ]
  }
}

export default nextConfig