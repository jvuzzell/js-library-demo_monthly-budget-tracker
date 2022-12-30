const path = require('path');
var fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { Console } = require('console');
 
const PATHS = {
  src : path.resolve(__dirname, 'src' ), 
  icons : path.resolve(__dirname, 'src/app/assets/icons' )
}

const htmlFileRegex = new RegExp(/(src\/app\/pages\/)|(\/index.html)/, 'ig');
let htmlFiles = [];
let directories = ['src/app/pages/'];

while (directories.length > 0) {
  let directory = directories.pop();
  let dirContents = fs.readdirSync(directory).map(file => path.join(directory, file));
  
  htmlFiles.push(...dirContents.filter(file => file.endsWith('.html')));
  directories.push(...dirContents.filter(file => fs.statSync(file).isDirectory()));
}

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
        test: /\.scss|.css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },  
      {
        test: /\.(png|svg|jpg|gif|jpe?g)$/,  
        type: 'asset/resource',
        generator: {
          filename: 'image/[contenthash]_[name][ext]'
        }
      }
    ],
  },
  watch: true, 
  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000,
  },
  plugins: [
    // Build a new plugin instance for each .html file found
    ...htmlFiles.map(htmlFile =>
      new HtmlWebpackPlugin({
        template: htmlFile,
        filename: htmlFile.replace( htmlFileRegex, "" ) + ".html", 
        chunks: [ htmlFile ]
      })
  )
  ],
}
