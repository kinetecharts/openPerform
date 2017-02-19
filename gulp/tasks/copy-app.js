var gulp = require('gulp');
var config = require('../config').app;
var _ = require('lodash');

gulp.task('copy-app', function() {
	_.each(config, function(c) {
		return gulp.src(c.src).pipe(gulp.dest(c.dest));
	});
});