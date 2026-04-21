const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
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
      filename: 'scripts/[name].js',
      chunkFilename: 'scripts/[name].bundle.js',
      path: path.resolve(__dirname, 'build/resources/main/assets'),
      clean: true,
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
            },
          },
        },
        {
          test: /\.vue$/,
          use: 'vue-loader',
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
        filename: 'styles/[name].css',
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
  if (env.analyze) {
    config.plugins.push(new BundleAnalyzerPlugin())
  }
  return config
}
