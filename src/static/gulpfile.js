var gulp = require('gulp');
var merge = require('merge-stream');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var less = require('gulp-less');
var path = require('path');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');

gulp.task('css', function () {
  var contribs = gulp.src([
    'bower_components/skeleton/css/normalize.css',
    'bower_components/skeleton/css/skeleton.css',
    'node_modules/sweetalert/dist/sweetalert.css'
  ]);

  var app = gulp.src('src/less/app.less')
    .pipe(less({
      paths: [
        path.join(__dirname, 'src/less'),
        path.join(__dirname, 'src/less/includes')
      ]
    }));

  merge(contribs, app)
    .pipe(minifyCSS())
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('js', function() {
  gulp.src('src/js/main.jsx')
    .pipe(browserify({transform: 'reactify'}))
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('build', ['css', 'js']);

gulp.task('default', ['build'], function() {
  gulp.watch('src/less/**/*.less', ['css']);
  gulp.watch('src/js/**/*', ['js']);
});
