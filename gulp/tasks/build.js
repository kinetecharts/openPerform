var gulp = require('gulp');

gulp.task('build', [
	'copy',
	'markup',
	'less',
	'browserify'
]);
