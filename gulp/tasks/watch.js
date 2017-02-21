/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp   = require('gulp');
var config = require('../config');

gulp.task('watch', ['setWatch', 'browserSync'], function() {
	gulp.watch([config.copy.video.src, config.copy.libs.src, 
		config.copy.images.src, config.copy.fonts.src, 
		config.copy.data.src, config.copy.glsl.src, config.copy.textures.src], ['copy']);
	gulp.watch([config.markup.src], ['markup']);
	gulp.watch([config.less.src], ['less']);
	gulp.watch([config.three.src, config.config.src, config.react.src, config.inputs.src, config.effects.src], ['browserify']);
});