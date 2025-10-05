/** @type {import('next').NextConfig} */
const nextConfig = {
  // appDir is now stable in Next.js 15, no need for experimental flag
  outputFileTracingRoot: __dirname,
  experimental: {
    // Optimizaciones para mejor rendimiento
    optimizeCss: true,
  },
}

module.exports = nextConfig
