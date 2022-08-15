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
const outDir = resolve(rootDir, 'dist/libs/cli-tools')
const tsconfig = resolve(__dirname, 'tsconfig.json')

/**
 * webpack config
 */
const compiler = webpack({
  target: 'node',
  mode: 'development',
  optimization: {
    minimize: false,
    nodeEnv: false,
  },
  entry: {
    jest: resolve(__dirname, 'src/jest/index.ts'),
    jest_scan: resolve(__dirname, 'src/jest/scan.ts'),
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs-module',
    path: outDir,
  },
  module: {
    rules: [{ test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ }],
  },
  resolve: {
    roots: [rootDir],
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({ configFile: tsconfig })],
  },
})

module.exports = compiler
