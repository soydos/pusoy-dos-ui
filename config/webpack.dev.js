const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = env => merge({
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
        template: './assets/index.html',
        templateParameters: {
            ga: 'xxxxxx-x'
        }
    }),
  ]
}, common);
