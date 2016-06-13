var gulp = require('gulp');
var karma = require('karma').server;
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var path = require('path');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');

/**
 * File patterns
 **/

var rootDirectory = path.resolve('./');
var sourceDirectory = path.join(rootDirectory, './src');
var testDirectory = path.join(rootDirectory, './test/unit');

var sourceFiles = [
  path.join(sourceDirectory, '/**/*.module.js'),
  path.join(sourceDirectory, '/**/*.js')
];

var lintFiles = [
  'gulpfile.js',
  'karma-*.conf.js'
].concat(sourceFiles);

gulp.task('build', function () {
  gulp.src(sourceFiles)
    .pipe(plumber())
    .pipe(concat('angular-format-number.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(uglify())
    .pipe(rename('angular-format-number.min.js'))
    .pipe(gulp.dest('./dist'));
});

/**
 * Process
 */
gulp.task('process-all', function (done) {
  runSequence('jshint', 'test-src', 'build', done);
});

/**
 * Watch task
 */
gulp.task('watch', function () {
  gulp.watch(sourceFiles, ['process-all']);
  gulp.watch(path.join(testDirectory, '/**/*.js'), ['test-src']);
});

/**
 * Validate source JavaScript
 */
gulp.task('jshint', function () {
  return gulp.src(lintFiles)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

/**
 * Run test once and exit
 */
gulp.task('test-src', function (done) {
  karma.start({
    configFile: __dirname + '/karma-src.conf.js',
    singleRun: true
  }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-concatenated', function (done) {
  karma.start({
    configFile: __dirname + '/karma-dist-concatenated.conf.js',
    singleRun: true
  }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-minified', function (done) {
  karma.start({
    configFile: __dirname + '/karma-dist-minified.conf.js',
    singleRun: true
  }, done);
});

gulp.task('default', function () {
  runSequence('process-all', 'watch');
});
