const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
      },
      {
        test: /\.sass$/,
        use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[name]__[local]--[hash:base64:5]',
                importLoaders: 2
              }
            },
            'sass-loader' // compiles Sass to CSS, using Node Sass by default
        ]
      },
      {
      test: /\.(jpg|png|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[contenthash].[ext]',
          },
        },
      },
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks (chunk) { return chunk.name !== 'wasm'; },
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: './assets/index.html',
        templateParameters: {
            ga: process.env.GA || 'xxxxxx-x',
            commit_ref: process.env.COMMIT_REF || 'dev',
            client_id: process.env.CLIENT_ID || 'UqeR63lpa4C7S8lLiPvmrrtKkCPueztb',
        }
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[contenthash].css',
    }),
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../')
    }),
    new CopyPlugin([
      {
        from: './assets/static',
        to: path.resolve(__dirname, '../', 'dist'), 
      },
    ]), 
  ],
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    path: path.resolve(__dirname, '../', 'dist')
  },
};


