/* jshint esversion: 5 */

'use strict';

// var _ = require('lodash');
// var webpack = require('webpack');
// var fs = require('fs');
// var path = require('path');
// var serveStatic = require('serve-static');
// var args = process.argv.slice(2);

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  require('time-grunt')(grunt);

  const webpackConfig = require('./build/webpack.dev.conf').devWebpackConfig;

  console.log(webpackConfig);

  grunt.initConfig({
    shell: {
      build: {
        command: 'node ./build/build.js --colors'
      }
    },
    watch: {
    },
    env: {
    },
    clean: {
      options: {},
      dist: [ 'dist' ]
    },
    eslint: {
      target: [
        '*.js',
        'src/**/*.js'
      ]
    },
    'webpack-dev-server': {
      options: {
        webpack: webpackConfig
      },
      start: {
        keepalive: true,
        historyApiFallback: true,
        noInfo: true,
        inline: true,
        hot: true,
        compress: true,
        watchOptions: {
          aggregateTimeout: 300,
          poll: 1000
        }
      }
    }
  });

  grunt.registerTask('build', [ 'clean', 'shell:build' ]);

  grunt.registerTask('dev', function (target) {
    grunt.task.run([
      'eslint',
      'webpack-dev-server:dev'
    ]);
  });
};
