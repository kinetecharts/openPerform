var gulp = require('gulp');
var config = require('../config').copy;
var _ = require('lodash');

gulp.task('copy', function() {
	_.each(config, function(c) {
		return gulp.src(c.src).pipe(gulp.dest(c.dest));
	});
});