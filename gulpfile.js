'use strict';
var connect = require('gulp-connect');
var gulp        = require('gulp'),
	gutil       = require('gulp-util'),
	source      = require('vinyl-source-stream'),
	browserify  = require('browserify'),
	watchify    = require('watchify'),
	babelify    = require('babelify'),
	notify = require('gulp-notify'),
	rename = require('gulp-rename'),
	buffer = require('vinyl-buffer'),
	merge = require('utils-merge'),
	duration = require('gulp-duration');

var browserifySrc = 'index.js',
	outputDist = './'; // dist/js
	outputDist = 'dist/js';

function mapError(err) {
	if (err.fileName) {
		// Regular error
		gutil.log(gutil.colors.red(err.name)
			+ ': ' + gutil.colors.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
			+ ': ' + 'Line ' + gutil.colors.magenta(err.lineNumber)
			+ ' & ' + 'Column ' + gutil.colors.magenta(err.columnNumber || err.column)
			+ ': ' + gutil.colors.blue(err.description));
	} else {
		// Browserify error..
		gutil.log(gutil.colors.red(err.name)
			+ ': '
			+ gutil.colors.yellow(err.message));
	}
}

// Completes the final file outputs
function bundle(bundler) {
	var bundleTimer = duration('Javascript bundle time');
	bundler
		.bundle()
		.on('error', mapError) // Map error reporting
		.pipe(source('index.js')) // Set source name
		.pipe(buffer()) // Convert to gulp pipeline
		.pipe(rename('index.js')) // Rename the output file
		.pipe(gulp.dest(outputDist)) // Set the output folder
		.pipe(notify({
			message: 'Generated file: <%= file.relative %>',
		})) // Output the file being created
		.pipe(bundleTimer); // Output time timing of the file creation

	bundler.on('time', function (time) {
		gutil.log('✅ ', gutil.colors.green('Built Scripts in'), gutil.colors.cyan(time + 'ms'));
	});
}


gulp.task('browserify', function() {
	var args = merge(watchify.args, { debug: false }); // Merge in default watchify args with browserify arguments
	var bundler = browserify(browserifySrc, args) // Browserify
		.plugin(watchify, {ignoreWatch: ['**/node_modules/**', '**/bower_components/**']}) // Watchify to watch source file changes
		.transform(babelify, {presets: ['es2015', 'react']}); // Babel tranforms

	bundle(bundler); // Run the bundle the first time (required for Watchify to kick in)

	bundler.on('update', function() {
		bundle(bundler); // Re-run bundle on source updates
	});
});

gulp.task('copy',function () {
	gulp.src('src/index.html').pipe(gulp.dest('dist')); //copy index html
});


gulp.task('server', function() {
	connect.server({
		root: 'dist',
		host: 'localhost',
		port: 3200,
		livereload: false
	});
});



gulp.task('default', ['copy','browserify','server']);

