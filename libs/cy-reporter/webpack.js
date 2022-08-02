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
const outDir = resolve(rootDir, 'dist/libs/cy-reporter')
const tsconfig = resolve(__dirname, 'tsconfig.json')

/**
 * webpack config
 */
const compiler = webpack({
  target: 'node',
  mode: 'development',
  entry: {
    json: resolve(__dirname, 'src/reporters/json.ts'),
    list: resolve(__dirname, 'src/reporters/list.ts'),
    sender: resolve(__dirname, 'src/reporters/sender.ts'),
    server: resolve(__dirname, 'src/server/main.ts'),
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
    roots: [rootDir],
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({ configFile: tsconfig })],
  },
})

/**
 * runs
 */
const args = process.argv.slice(2)
const showErrors = (s) => (s.hasErrors() ? console.log(s.toString()) : null)

/**
 * run the build once
 */
if (args.includes('--build')) {
  compiler.run((_, stats) => showErrors(stats))
}

/**
 * run the build and watch for changes
 */
if (args.includes('--watch')) {
  compiler.watch({ aggregateTimeout: 300 }, (_, stats) => {
    showErrors(stats)
    console.log('built cy-reporter at', new Date().toLocaleString())
  })
}
