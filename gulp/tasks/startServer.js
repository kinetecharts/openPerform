var gulp = require('gulp');
var shell = require('gulp-shell');

var config = require('../config').node;

gulp.task('startServer', function() {
	return gulp.src('').pipe(shell(['node ' + config.path]));
});