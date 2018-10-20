const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    main: [
      './src/main/frontend/scripts/main.js',
      './src/main/frontend/styles/main.scss'
    ]
  },
  output: {
    filename: 'scripts/[name].js',
    path: path.resolve(__dirname, 'src/main/resources/assets'),
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
            plugins: ["@babel/plugin-syntax-dynamic-import"]
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { 
              sourceMap: true 
            }
          },
          { 
            loader: 'postcss-loader',
            options: {
              sourceMap: 'inline',
              plugins: [
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
              sourceMap: true 
            }
          }
        ],
      }
    ]
  },
  resolve: {
    extensions: ['.js', 'scss'],
  },
  stats: 'normal',
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css'
    })
  ]
}
