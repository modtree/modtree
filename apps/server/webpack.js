const webpack = require('webpack')
const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

/**
 * configuration paths
 */
const rootDir = path.resolve(__dirname, '../..')
const outDir = path.resolve(rootDir, 'dist/apps/server')
const entry = path.resolve(__dirname, 'src/main.ts')
const tsconfig = path.resolve(__dirname, 'tsconfig.app.json')

/** whether or not to watch for changes */
const watch = false

const compiler = webpack({
  entry,
  target: 'node',
  mode: 'development',
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
    extensions: ['.tsx', '.ts', '.js'],
    /**
     * this is what allows custom paths such as `@modtree/utils`
     * to be resolved
     */
    plugins: [new TsconfigPathsPlugin({ configFile: tsconfig })],
  },
  output: {
    filename: 'bundle.js',
    path: outDir,
  },
})

if (watch) {
  /**
   * watch for changes
   */
  compiler.watch(
    {
      aggregateTimeout: 300,
    },
    (err, stats) => {
      if (stats.hasErrors()) {
        console.log(stats.toString())
      }
    }
  )
} else {
  /**
   * just build once
   */
  compiler.run((_err, stats) => {
    if (stats.hasErrors()) {
      console.log(stats.toString())
    }
    compiler.close((_closeErr) => {})
  })
}
