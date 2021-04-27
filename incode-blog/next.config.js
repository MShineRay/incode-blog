/* eslint-disable @typescript-eslint/no-var-requires */
const withImages = require('next-images')
const withPlugins = require('next-compose-plugins')

const nextConfig = {
  images: {
    domains: ['localhost', 'static.ghost.org'],
    deviceSizes: [320, 480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // https://github.com/vercel/next.js/issues/21079
    loader: 'imgix',
    path: '',
  },
  inlineImageLimit: false,
  poweredByHeader: false,
}

module.exports = withPlugins([[withImages]], nextConfig)
