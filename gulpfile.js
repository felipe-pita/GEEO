'use strict';

var gulp = require('gulp');

var dist = './dist';

gulp.task('sass', function () {
	var sass = require('gulp-sass');

	return gulp.src(['./assets/styles/**/*.sass'])
	.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	.pipe(gulp.dest(dist));
});

gulp.task('js', function () {
	
	return gulp.src(['./assets/scripts/**/*.js'])
	.pipe(gulp.dest(dist));
});

gulp.task('images', function () {
	
	return gulp.src(['./assets/images/**/*'])
	.pipe(gulp.dest(dist + '/images'));
});

gulp.task('html', function () {
	
	return gulp.src(['./*.html'])
	.pipe(gulp.dest(dist));
});
 
gulp.task('webserver', function() {
	var webserver = require('gulp-webserver');
	
	return gulp.src('dist')
	.pipe(webserver({
		livereload: true,
		directoryListing: true,
		open: true,
		fallback: 'index.html'
	}));
});
 
gulp.task('default', ['sass', 'js', 'images', 'html', 'webserver'], function () {
  gulp.watch(['./assets/styles/**/*.sass'], ['sass']);
  gulp.watch(['./assets/scripts/**/*.js'], ['js']);
  gulp.watch(['./assets/images/**/*'], ['images']);
  gulp.watch(['./*.html'], ['html']);
});