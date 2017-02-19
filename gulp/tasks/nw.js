var NwBuilder = require('nw-builder');
var gulp = require('gulp');
var gutil = require('gulp-util');

var config = require('../config').nw;

gulp.task('nw', function() {

	var nw = new NwBuilder({
		files: config.src,
		version: '0.18.8',
		// flavor: 'Normal',
		platforms: ['osx64', 'win32', 'win64'],
		appName: config.name,
		appVersion: config.version,
		buildDir: config.dest,
		cacheDir: config.cache,
		buildType: 'versioned',
		forceDownload: true,
		macIcns: config.icons.mac,
		title: config.name,
		// kiosk:true,
		// zip: true
		maintainers:config.maintainers
		
	});

	// Log stuff you want
	nw.on('log', function(msg) {
		gutil.log('nw-builder', msg);
	});

	// Build returns a promise, return it so the task isn't called in parallel
	return nw.build().catch(function(err) {
		gutil.log('nw-builder', err);
	});
});