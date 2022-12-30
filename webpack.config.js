const path = require('path');
var fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ContextExclusionPlugin } = require('webpack');
 
const htmlFileRegex = new RegExp(/(src\/app\/pages\/)|(\/index.html)/, 'ig');
let htmlFiles = [];
let entryPoints = {};
let directories = ['src/app/pages/'];

while (directories.length > 0) {
  let directory = directories.pop();
  let dirContents = fs.readdirSync(directory).map(file => path.join(directory, file));

  htmlFiles.push(...dirContents.filter(file => file.endsWith('.html')));
  directories.push(...dirContents.filter(file => fs.statSync(file).isDirectory()));
}

htmlFiles.map(file => {
    let name = file.replace( htmlFileRegex, "" );
    entryPoints[ name ] = path.resolve(
      __dirname, file.replace( ".html", ".js" )
    );
  }
); 

module.exports = {
  mode: 'development',
  entry: entryPoints,
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name]_[contenthash].js',
    clean: false,
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
          filename: 'images/[name][ext]'
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
    ...htmlFiles.map(htmlFile =>
      new HtmlWebpackPlugin({
        template: htmlFile,
        filename: htmlFile.replace( htmlFileRegex, "" ) + ".html", 
        chunks: [ htmlFile.replace( htmlFileRegex, "" ) ]
      })
  )
  ],
}
