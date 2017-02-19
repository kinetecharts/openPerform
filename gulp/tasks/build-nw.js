var gulp = require('gulp');

gulp.task('build-nw', ['copy', 'copy-app', 'iconify', 'browserify', 'markup', 'less', 'nw']);