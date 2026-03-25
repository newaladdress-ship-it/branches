/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/category/:categorySlug',
        destination: '/categories/:categorySlug',
        permanent: true,
      },
      {
        source: '/businesses/:city/:categorySlug',
        destination: '/locations/:city/:categorySlug',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
