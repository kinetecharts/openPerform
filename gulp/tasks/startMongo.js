var gulp = require('gulp');
var shell = require('gulp-shell');

var config = require('../config').mongodb;

gulp.task('startMongo', function() {
	if (config.enabled) {
		return gulp.src('').pipe(shell(['mongod --dbpath ' + config.dbpath + ' --port ' + config.port]));
	}
	return false;
});
