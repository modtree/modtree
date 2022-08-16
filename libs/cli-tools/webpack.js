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
const tsconfig = resolve(__dirname, 'tsconfig.lib.json')

/**
 * webpack config
 */
const compiler = webpack({
  target: 'node',
  mode: 'development',
  optimization: { nodeEnv: false },
  entry: {
    'jest:main': resolve(__dirname, 'src/jest/index.ts'),
    'jest:scan': resolve(__dirname, 'src/jest/scan.ts'),
    'cypress:main': resolve(__dirname, 'src/cypress/cli/index.ts'),
    'cypress:json': resolve(__dirname, './src/cypress/reporters/json.ts'),
    'cypress:sender': resolve(__dirname, './src/cypress/reporters/sender.ts'),
    'cypress:server': resolve(__dirname, './src/cypress/server/main.ts'),
    'migration:main': resolve(__dirname, './src/migration/index.ts'),
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs-module',
    path: outDir,
  },
  module: {
    rules: [{ test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ }],
  },
  plugins: [new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ })],
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({ configFile: tsconfig })],
  },
})

module.exports = compiler
