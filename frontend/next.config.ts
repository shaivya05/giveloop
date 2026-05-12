/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: 'https://giveloop.onrender.com/api/:path*'
      }
    ]
  }
}

export default nextConfig