/**
 * executing this file bundles the the server project and all its dependencies
 * into one executable pure nodejs file.
 */
const webpack = require('webpack')
const { resolve } = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const nodemon = require('nodemon')

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
    cli: resolve(__dirname, 'src/cli'),
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
const showErrors = (s) =>
  console.log(s.hasErrors() ? s.toString() : 'Build succeeded.')

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

  // start a node server running the cy-reporter proxy
  nodemon({
    script: resolve(rootDir, 'dist/libs/cy-reporter/server.js'),
    watch: resolve(rootDir, 'dist/libs/cy-reporter'),
  })

  /**
   * Breakdown for future debugging.
   */
  nodemon
    .on('quit', () => process.exit())
    .on('restart', (files) => {
      console.log('cy-reporter server restarted due to: ', files)
    })
}
