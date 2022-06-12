const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.js',
})

const distDir =
  process.env.NODE_ENV === 'production' ? undefined : '../../dist/apps/docs'

module.exports = withNextra({
  distDir,
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
})
