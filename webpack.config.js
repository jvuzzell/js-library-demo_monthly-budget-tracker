const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require( './deploy/config.json' );
 
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

module.exports = ( env ) => {

  const publicPath = ( env.production ) ? config.targets.prod.publicPath : config.targets.dev.publicPath; 
  const assetModuleFilename = ( env.production ) ? config.targets.prod.assetModuleFilename : config.targets.dev.assetModuleFilename; 
  const watch = ( env.production ) ? false : true;  
  const clean = ( env.production ) ? true : false;  

  return {
    mode: 'development',
    entry: entryPoints,
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: '[name]_[contenthash].js',
      clean: clean,
      assetModuleFilename: assetModuleFilename + './[name][ext]',
      publicPath: publicPath + '/'
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.scss|.css$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        },  
        {
          test: /\.(png|svg|jpg|gif|jpe?g|ico)$/,  
          type: 'asset/resource',
          generator: {
            filename: 'images/[name][ext]'
          }
        }
      ],
    },
    watch: watch, 
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
    ]
  }

}
