const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // This was removed as it's not suitable for a dynamic dev server
  images: {
    unoptimized: true,
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  compiler: {
    // This is the correct way to enable styled-components in Next.js
    styledComponents: true,
  }
}

module.exports = withMDX(nextConfig)