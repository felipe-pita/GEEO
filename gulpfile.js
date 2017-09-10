'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const dist = './dist';

/*
 * SASS
 */
const sass = require('gulp-sass');

gulp.task('sass', function () {
	return gulp.src(['./assets/styles/**/*.sass'])
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
		.pipe(gulp.dest(dist));
});

/*
 * JS
 */
const babel = require('gulp-babel');

gulp.task('js', function () {
	gulp.src(['./assets/scripts/**/*', '!./assets/scripts/main.js'])
		.pipe(gulp.dest(dist));

	gulp.src(['./assets/scripts/main.js'])
		.pipe(plumber())
		.pipe(babel({
			presets: ['env']
		}))
		.pipe(gulp.dest(dist));
});

/*
 * Images
 */
gulp.task('images', function () {
	return gulp.src(['./assets/images/**/*'])
		.pipe(gulp.dest(dist + '/images'));
});

/*
 * Sounds
 */
gulp.task('sounds', function () {
	return gulp.src(['./assets/sounds/**/*'])
		.pipe(gulp.dest(dist + '/sounds'));
});

/*
 * HTML
 */
gulp.task('html', function () {
	return gulp.src(['./*.html'])
		.pipe(gulp.dest(dist));
});

/*
 * Server
 */
const webserver = require('gulp-webserver');

gulp.task('webserver', function() {
	return gulp.src('./')
		.pipe(webserver({
			livereload: false,
			directoryListing: true,
			open: true,
		}));
});

/*
 * Deploy
 */
const ghPages = require('gulp-gh-pages');

gulp.task('deploy', function() {
	return gulp.src('./dist/**/*')
	.pipe(ghPages());
});

/*
 * default
 *
 * uma familia muito unida, mas também muito ouriçada...
 */
gulp.task('default', ['sass', 'js', 'images', 'html', 'sounds', 'webserver'], function () {
  gulp.watch(['./assets/styles/**/*'], ['sass']);
  gulp.watch(['./assets/scripts/**/*'], ['js']);
  gulp.watch(['./assets/images/**/*'], ['images']);
  gulp.watch(['./*.html'], ['html']);
});
