const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge({
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
        template: './assets/index.html',
        templateParameters: {
            ga: env.ga
        }
    }),
  ]
}, common);
