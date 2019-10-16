const { join } = require('path')

const WebpackPwaManifest = require('webpack-pwa-manifest')
const LoadablePlugin = require('@loadable/webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { DefinePlugin } = require('webpack')

const manifest = require('./src/manifest.json')

const PRODUCTION = process.env.NODE_ENV === 'production'

module.exports = {
  mode: PRODUCTION ? 'production' : 'development',
  plugins: [
    new LoadablePlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css'
    }),
    new WebpackPwaManifest(manifest),
    new DefinePlugin({
      'process.env.BROWSER': JSON.stringify(true)
    })
  ],
  entry: {
    main: './src/client'
  },
  output: {
    path: join(__dirname, 'dist'),
    filename: '[name].[chunkhash].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader'
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [ join(__dirname, 'src/client/styles') ]
              }
            }
          }
        ]
      }
    ]
  }
}
