const path = require('path');
const webpackConfig = require('./webpack.config');

webpackConfig.devtool = 'inline-source-map';
delete webpackConfig.externals;
delete webpackConfig.entry;

module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['es5-shim', 'jasmine'],

    files: [
      {pattern: 'test/**/*-spec.js', watched: false, included: true, served: true},
    ],

    exclude: [
    ],

    preprocessors: {
      'test/**/*.js': ['webpack', 'sourcemap'],
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: {
        chunkModules: false,
        colors: true,
      },
      noInfo: true
    },

    reporters: ['dots'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['PhantomJS'],

    singleRun: false,
    concurrency: Infinity,
  });
};
