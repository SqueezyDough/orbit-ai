/* eslint-disable no-mixed-spaces-and-tabs */
let gulp = require("gulp");
var sass = require("gulp-sass");

gulp.task("sass", function(){
	return gulp.src("lib/scss/**/*.scss")
	  .pipe(sass()) // Converts Sass to CSS with gulp-sass
	  .pipe(gulp.dest("lib/dist"));
});

gulp.task("watch", function(){
	gulp.watch("lib/scss/**/*.scss", gulp.series("sass"));
});