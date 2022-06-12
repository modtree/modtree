const distDir =
  process.env.NODE_ENV === 'production' ? undefined : '../../dist/apps/web'

module.exports = {
  distDir,
  reactStrictMode: true,
  experiments: {
    esmExternals: true,
  },
}
