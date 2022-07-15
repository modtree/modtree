const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.js',
})

module.exports = withNextra({
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
})
