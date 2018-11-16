const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (env, argv) => {
  console.log(JSON.stringify(argv, null, 2))
  const PROD_MODE = argv.mode === 'production' || process.env.NODE_ENV === 'production'
  return {
    entry: {
      main: ['./src/main/frontend/scripts/main.js', './src/main/frontend/styles/main.scss']
    },
    output: {
      filename: PROD_MODE ? 'scripts/[name].min.js' : 'scripts/[name].js',
      path: path.resolve(__dirname, 'src/main/resources/assets')
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
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-syntax-dynamic-import']
            }
          }
        },
        {
          test: /\.vue$/,
          use: 'vue-loader'
        },
        {
          test: /\.(sass|scss|css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: PROD_MODE ? false : true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: PROD_MODE ? false : 'inline',
                plugins: PROD_MODE
                  ? [
                      require('postcss-preset-env')({
                        autoprefixer: {
                          grid: true
                        }
                      }),
                      require('postcss-csso')()
                    ]
                  : [
                      require('postcss-preset-env')({
                        autoprefixer: {
                          grid: true
                        }
                      })
                    ]
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: PROD_MODE ? false : true
              }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.vue', '.css', '.scss']
    },
    stats: 'normal',
    plugins: [
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: PROD_MODE ? 'styles/[name].min.css' : 'styles/[name].css'
      }),
      new CopyWebpackPlugin([{ from: './src/main/frontend/gfx', to: 'gfx' }])
    ]
  }
}
