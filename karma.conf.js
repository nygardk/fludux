const path = require('path');
const webpackConfig = require('./webpack.config');

webpackConfig.resolve.root.push(path.resolve('./test'));
webpackConfig.devtool = 'inline-source-map';
delete webpackConfig.entry;

module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['jasmine'],

    files: [
      {pattern: 'node_modules/react-tools/src/test/phantomjs-shims.js', watched: false, included: true, served: true},
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
        color: true
      },
      noInfo: true
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['PhantomJS'],

    singleRun: false,
    concurrency: Infinity
  });
};
