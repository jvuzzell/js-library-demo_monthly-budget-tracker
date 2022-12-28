const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    index: path.resolve(__dirname, 'src/app/pages/home/index.js'), 
    reports: path.resolve(__dirname, 'src/app/pages/reports/index.js')
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name]_[contenthash].js',
    clean: true,
    assetModuleFilename: '[name][ext]',
    publicPath: '/'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ],
  },
  watch: true, 
  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Monthly Budget Tracker',
      filename: 'index.html',
      template: 'src/app/pages/home/index.html',
      chunks: [ 'index' ]
    }), 
    new HtmlWebpackPlugin({
      title: 'Budget Reports',
      filename: 'reports.html',
      template: 'src/app/pages/reports/index.html', 
      chunks: [ 'reports' ]
    })
  ],
}
