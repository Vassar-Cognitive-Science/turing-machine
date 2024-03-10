var path = require('path')
var webpack = require('webpack')
var config = require('./config.js')

process.noDeprecation = true;
module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
    'whatwg-fetch',
    'core-js/fn/promise',
    path.resolve(__dirname, '../src/client/index.js')
  ],
  output: {
    path: path.join(__dirname, '../public/static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.DefinePlugin({
      ENV: JSON.stringify('development'),
      FIREBASE_PROJECT_ID: JSON.stringify(config.dev.firebaseProjectId)
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: path.resolve(__dirname, '../'),
        query: {
          presets: ['react-hmre']
        }
      }
    ]
  }
}
