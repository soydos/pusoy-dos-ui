const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: process.env.PORT || 8080,
    host: process.env.IP || '0.0.0.0',
    disableHostCheck: true
  }
});
