const url = new URL(process.env.NEXT_APP_INVIDIOUS_INSTANCE);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/manifest/hls_variant/:path*',
  //       destination: 'https://manifest.googlevideo.com/api/manifest/hls_variant/:path*'
  //     }
  //   ]
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: url.hostname,
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: '*.ggpht.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      }
    ],
  }
}

module.exports = nextConfig
