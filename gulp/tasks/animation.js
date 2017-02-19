var gulp = require('gulp');
var config = require('../config').animation;

gulp.task('animation', function() {
	console.log('running gulp animation: ' + config.src + ' to ' + config.dest);
	return gulp.src(config.src)
		.pipe(gulp.dest(config.dest));
});