const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = (env, argv) => {
  console.log(JSON.stringify(argv, null, 2))
  console.log(JSON.stringify(env, null, 2))
  const PROD_MODE = argv.mode === 'production' || process.env.NODE_ENV === 'production'
  const config = {
    mode: PROD_MODE ? 'production' : 'development',
    devtool: PROD_MODE ? false : 'inline-source-map',
    entry: {
      main: './src/main/frontend/scripts/main.js',
    },
    output: {
      filename: PROD_MODE ? 'scripts/[name].min.js' : 'scripts/[name].js',
      chunkFilename: PROD_MODE ? 'scripts/[name].bundle.min.js' : 'scripts/[name].bundle.js',
      path: path.resolve(__dirname, 'build/resources/main/assets'),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [['@babel/preset-env']],
              plugins: ['@babel/plugin-syntax-dynamic-import'],
            },
          },
        },
        {
          test: /\.vue$/,
          use: 'vue-loader',
        },
        {
          resourceQuery: /blockType=i18n/,
          type: 'javascript/auto',
          loader: '@intlify/unplugin-vue-i18n',
        },
        {
          test: /\.(sass|scss|css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: PROD_MODE ? false : true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: PROD_MODE ? false : true,
                postcssOptions: {
                  plugins: [
                    require('postcss-preset-env')({
                      autoprefixer: {
                        grid: true,
                      },
                    }),
                  ],
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: PROD_MODE ? false : true,
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.vue', '.css', '.scss'],
    },
    stats: 'normal',
    plugins: [
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: PROD_MODE ? 'styles/[name].min.css' : 'styles/[name].css',
      }),
      new CopyWebpackPlugin({
        patterns: [
          ({
            from: './src/main/frontend/gfx',
            to: 'gfx',
            ignore: ['.*'],
          },
          {
            from: './node_modules/lazysizes/lazysizes.min.js',
            to: 'scripts',
          },
          {
            from: './node_modules/lazysizes/plugins/blur-up/ls.blur-up.min.js',
            to: 'scripts',
          }),
        ],
      }),
    ],
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  }
  if (env === 'analyze') {
    config.plugins.push(new BundleAnalyzerPlugin())
  }
  return config
}
