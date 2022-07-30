/**
 * executing this file bundles the the server project and all its dependencies
 * into one executable pure nodejs file.
 */
const webpack = require('webpack')
const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

/**
 * configuration paths
 */
const rootDir = path.resolve(__dirname, '../..')
const outDir = path.resolve(rootDir, 'dist/libs/cy-reporter')
// const outDir = path.resolve(rootDir, 'apps/web-e2e/reporters')
const d = (r) => path.resolve(__dirname, r)
const entry = {
  json: d('src/json.ts'),
  list: d('src/list.ts'),
  sender: d('src/sender.ts'),
}
const tsconfig = path.resolve(__dirname, 'tsconfig.lib.json')

const defaultConfig = {
  mode: 'development',
  optimization: undefined,
  build: false,
}

/**
 * handle arguments
 */
const getArgsConfig = () => {
  const config = defaultConfig
  const args = process.argv.slice(2)
  const handled = []
  args.forEach((arg) => {
    switch (arg) {
      case '--build':
        handled.push(arg)
        config.build = true
        break
      case '--prod':
        handled.push(arg)
        config.mode = 'production'
        config.optimization = { minimize: false }
        break
    }
  })
  console.log('args handled:', handled)
  return config
}
const argsConfig = getArgsConfig()

const compiler = webpack({
  entry,
  target: 'node',
  mode: argsConfig.mode,
  optimization: argsConfig.optimization,
  module: {
    rules: [
      {
        test: /\.ts$/, // apply ts-loader on files ending with .ts
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^pg-native$/,
    }),
  ],
  resolve: {
    roots: [rootDir],
    extensions: ['.tsx', '.ts', '.js'],
    /**
     * this is what allows custom paths such as `@modtree/utils`
     * to be resolved
     */
    plugins: [new TsconfigPathsPlugin({ configFile: tsconfig })],
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs-module',
    path: outDir,
  },
})

module.exports = compiler

if (argsConfig.build == true) {
  /** run the build once */
  compiler.run((_err, stats) => {
    if (stats.hasErrors()) {
      console.log(stats.toString())
    }
    compiler.close((_closeErr) => {})
  })
}
