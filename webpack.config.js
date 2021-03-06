const webpack = require('webpack');
const path = require('path');

const ENV = process.env.NODE_ENV;

module.exports = {
  debug: true,
  devtool: ENV === 'development' ? 'cheap-module-eval-source-map' : false,
  entry: {
    fludux: 'fludux'
  },
  output: {
    path: path.resolve('./lib'),
    filename: 'index.js',
    library: 'fludux',
    libraryTarget: 'umd'
  },
  resolve: {
    root: [
      path.resolve('./src/js'),
      path.resolve('./src')
    ],
    extensions: ['', '.js', '.jsx']
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'eslint'
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel'
      }
    ]
  },
  externals: {
    'react': 'react'
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
  ],
  eslint: {
    failOnWarning: false,
    failOnError: false,
    configFile: '.eslintrc'
  }
};
