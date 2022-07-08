const webpack = require('webpack')
const isProd = process.env.NODE_ENV === 'production'
const distDir = isProd ? undefined : '../../dist/apps/web'

module.exports = {
  distDir,
  reactStrictMode: true,
  experiments: {
    esmExternals: true,
  },
  webpack: (config) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^react-native-sqlite-storage$/,
      })
    )
    return config
  },
}
