const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, config) => {
  const devMode = config.mode === 'development';
  return ({
    entry: {
      main: [
        './src/index.js',
        './src/assets/style/general/main.scss',
      ],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
      compress: devMode,
      port: 3000,
      open: true,
      liveReload: true,
    },
    module: {
      rules: [
        // JS loader
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
        // SCSS-CSS loader
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: devMode,
                importLoaders: 1,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    [
                      'autoprefixer',
                      {
                        // Options
                      },
                    ],
                  ],
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  outputStyle: 'compressed',
                },
                sourceMap: devMode,
              },
            },
          ],
        },
        // Svg loader
        {
          test: /\.svg$/,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name][ext][query]',
          },
        },
        // Fonts loader
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext][query]',
          },
        },
        // Images loader
        {
          test: /\.(jpeg|png|gif|jpg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name][ext][query]',
          }
        },
      ]
    },
    plugins: [
      // Clean the dist folder between the build to prevent duplicate files
      new CleanWebpackPlugin({
        dry: false,
        verbose: false,
        cleanOnceBeforeBuildPatterns: ['*', '!manifest.json'],
        dangerouslyAllowCleanPatternsOutsideProject: true,
      }),
      // Build of html template file
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: './index.html',
        inline: !devMode,
        minify: !devMode,
        extract: !devMode,
        title: '',
        penthouse: {
          blockJSRequests: !devMode,
        },
      }),
      // Build css files and split by chunks
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: devMode ? 'css/[name].css' : 'css/[name].[fullhash].css',
        chunkFilename: devMode ? 'css/[name]_[id].css' : 'css/[name]_[id].[fullhash].css',
      }),
      // Copy the static file to dist folder
      new CopyPlugin({
        patterns: [
          { from: './public/favicon.ico', to: './' },
          { from: './src/assets/img/yingyang1.png', to: './images' },
          { from: './src/assets/img/yingyang2.png', to: './images' },
          { from: './src/assets/img/r2d2.png', to: './images' },
        ],
      }),
    ]
  });
}
