const HtmlCriticalWebpackPlugin = require('html-critical-webpack-plugin');
const path = require('path');
const webpackConfig = require('./webpack.config');

const devMode = process.argv[process.argv.length - 1] === 'development';

const prodConfig = webpackConfig[0];

prodConfig.plugins.push(
  new HtmlCriticalWebpackPlugin({
    base: devMode ? path.resolve(__dirname, 'public') : path.resolve(__dirname, 'dist'),
    src: 'index.html',
    dest: 'index.html',
    inline: true,
    minify: true,
    extract: true,
    width: 375,
    height: 565,
    penthouse: {
      blockJSRequests: false,
    },
  }),
);

module.exports = [prodConfig];
