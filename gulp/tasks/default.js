var gulp = require('gulp');

gulp.task('default', ['startMongo', 'startServer', 'lint', 'watch']);
