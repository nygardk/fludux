const path = require('path');
const baseConfig = require('./karma.conf.js');
const webpackConfig = require('./webpack.config');

webpackConfig.devtool = 'inline-source-map';
webpackConfig.module.postLoaders = [{
  test: /\.jsx?/,
  exclude: /(test|node_modules)/,
  loader: 'istanbul-instrumenter'
}];
delete webpackConfig.externals;
delete webpackConfig.entry;

module.exports = function(config) {
  baseConfig(config);

  config.set({
    webpack: webpackConfig,

    reporters: ['dots', 'coverage'],

    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },

    singleRun: true,
  });
}
