import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const stylusLoader = ExtractTextPlugin.extract("style-loader", "css-loader!stylus-loader");
const lessLoader = ExtractTextPlugin.extract("style-loader", "css-loader!less-loader");

console.log('dirname: ' + __dirname);
export default {
  // context: __dirname,
  entry: './entry.js',
  output:{
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module:{
    loaders:[
      {
        test: /\.js[x]?$/,
        // include: [
        //   path.resolve(__dirname, 'src')
        // ],
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ],
        loader: 'babel-loader',
        query:{
          presets: ['es2015', 'react', 'stage-1'],
          plugins:[
            'transform-decorators-legacy',
            [
              'import',
              {
                "libraryName": "antd",
                "style": true,
              }
            ]
          ]
        }
      },
      {
        test: /\.styl$/,
        loader: stylusLoader
      },
      {
        test: /\.less$/,
        loader: lessLoader
      },
      {
        test: /.*\.(gif|png|jpe?g|svg)$/i,
        loaders: [
          'file-loader?name=/[name].[ext]',
          // {
          //   loader: 'image-webpack-loader',
          //   query: {
          //     progressive: true,
          //     optimizationLevel: 7,
          //     interlaced: false,
          //     pngquant: {
          //       quality: '65-90',
          //       speed: 4
          //     }
          //   }
          // }
        ]
      }
    ]
  },
  plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      new ExtractTextPlugin("style.css"),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        comments: false
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin()
  ]
}
