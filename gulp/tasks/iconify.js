var gulp = require('gulp');
var png2icns = require('png2icns');
 
var config = require('../config').iconify;

gulp.task('iconify', function() {
	png2icns({
		in: config.src, // required 
		out: config.dest, // optional. .icns file name to save the file as. Default: icon.icns 
		sizes: [16, 32, 64, 128, 256, 512] // optional. 
	}, function() {
		console.log('Icon created: ', config.dest);
	});
});