var gulp = require('gulp');
var  less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var handleErrors = require('../util/handleErrors');
var config = require('../config').less;

gulp.task('less', function() {
	return gulp.src(config.src)
		.pipe(sourcemaps.init())
		.pipe(less())
		.on('error', handleErrors)
		.pipe(autoprefixer({cascade: false, browsers: ['last 2 versions']}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(config.dest));
});
