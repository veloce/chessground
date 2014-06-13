var source = require('vinyl-source-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var jshint = require('gulp-jshint');

gulp.task('lint', function() {
  return gulp.src('src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
  var bundleStream = browserify('./src/main.js').bundle({
    debug: true,
    standalone: 'Chessground'
  });

  return bundleStream
    .on('error', function(error) { gutil.log(gutil.colors.red(error.message)); })
    .pipe(source('chessground.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('dev', ['lint', 'scripts']);

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('src/*.js', ['lint', 'scripts']);
});

// Default Task
gulp.task('default', ['dev', 'watch']);
