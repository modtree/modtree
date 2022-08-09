/**
 * executing this file bundles the the server project and all its dependencies
 * into one executable pure nodejs file.
 */
const webpack = require('webpack')
const { resolve } = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

/**
 * configuration paths
 */
const rootDir = resolve(__dirname, '../..')
const outDir = resolve(rootDir, 'dist/apps/server')
const entry = resolve(__dirname, 'src/main.ts')
const tsconfig = resolve(__dirname, 'tsconfig.app.json')

/**
 * handle arguments
 */
const hasArg = (a) => process.argv.slice(2).includes(a)
const opts = { prod: hasArg('--prod') }

const compiler = webpack({
  target: 'node',
  mode: opts.prod ? 'production' : 'development',
  entry,
  output: { filename: 'bundle.js', path: outDir },
  module: {
    rules: [{ test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ }],
  },
  plugins: [new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ })],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({ configFile: tsconfig })],
  },
  optimization: { nodeEnv: false, minimize: false },
})

module.exports = compiler
