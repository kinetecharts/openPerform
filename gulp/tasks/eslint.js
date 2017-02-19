var gulp = require('gulp');
var eslint = require('gulp-eslint');
require('eslint-path-formatter').options.sourcemap = true;
var config = require('../config').lint;

gulp.task('lint', function() {
	return gulp.src(config.src)
		.pipe(eslint({
			formatter: config.formatter
		}))
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});