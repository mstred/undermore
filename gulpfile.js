'use strict';

var gulp = require('./gulp')({
    'bin': [],
    'clean': [],
    'cleandocs': [],
    'qunit': [],
    'jquery': [],
    'jsdoc': [],
    'jshint': [],

    'docs': ['clean', 'cleandocs'],
    'undermore': ['jshint']
});

// Task list
gulp.task('default', []);
gulp.task('build', ['docs', 'jquery', 'undermore', 'bin', 'qunit', 'jsdoc']);
gulp.task('docbuild', ['docs', 'jquery', 'undermore', 'bin', 'jsdoc']);
