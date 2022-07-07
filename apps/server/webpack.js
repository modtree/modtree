const webpack = require('webpack')
const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const rootDir = path.resolve(__dirname, '../..')

const outDir = path.resolve(rootDir, 'dist/apps/server')
const entry = path.resolve(rootDir, 'apps/server/src/main.ts')
const tsconfig = path.resolve(rootDir, 'apps/server/tsconfig.app.json')

const compiler = webpack({
  entry,
  target: 'node',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: tsconfig,
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: tsconfig,
      }),
    ],
  },
  output: {
    filename: 'bundle.js',
    path: outDir,
  },
})

compiler.run((_err, stats) => {
  if (stats.hasErrors()) {
    console.log(stats.toString())
  }
  compiler.close((_closeErr) => {})
})
