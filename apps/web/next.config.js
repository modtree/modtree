const webpack = require('webpack')
const isProd = process.env.NODE_ENV === 'production'
const distDir = isProd ? undefined : '../../dist/apps/web'

module.exports = {
  distDir,
  reactStrictMode: true,
  experimentalDecorators: true,
  experiments: {
    esmExternals: true,
    externalDir: true,
  },
  webpack: (config) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^react-native-sqlite-storage$/,
      })
    )
    // use ts-loader on all .ts files outside of apps/web
    config.module.rules.push({
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: [/node_modules/, /apps\/web/],
    })
    return config
  },
}
