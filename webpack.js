const webpack = require('webpack')
const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const outDir = path.resolve(__dirname, 'dist/apps/server')

const compiler = webpack({
  entry: './apps/server/src/main.ts',
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
              configFile: 'apps/server/tsconfig.app.json',
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
        configFile: 'apps/server/tsconfig.app.json',
      }),
    ],
  },
  output: {
    filename: 'bundle.js',
    path: outDir,
  },
})

compiler.run((err, stats) => {
  console.log('outDir:', outDir)
  // console.log(err)
  if (stats.hasErrors()) {
    console.log(stats.toString())
  }
  // [Stats Object](#stats-object)
  // ...

  compiler.close((closeErr) => {
    // console.log(closeErr)
    // ...
  })
})
