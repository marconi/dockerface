var gulp = require('gulp');
var merge = require('merge-stream');
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
var less = require('gulp-less');
var path = require('path');
var plumber = require('gulp-plumber');
var elm = require('gulp-elm');

gulp.task('css', function () {
  var contribs = gulp.src([
    'node_modules/milligram/dist/milligram.css',
  ]);

  var app = gulp.src('src/less/app.less')
    .pipe(less({
      paths: [
        path.join(__dirname, 'src/less'),
        path.join(__dirname, 'src/less/includes')
      ]
    }));

  merge(contribs, app)
    .pipe(plumber())
    .pipe(cssnano())
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('elm-init', elm.init);
gulp.task('elm', ['elm-init'], function() {
  return gulp.src('src/elm/Dockerface.elm')
    .pipe(plumber())
    .pipe(elm())
    .pipe(gulp.dest('dist/js'));
})

gulp.task('build', ['css', 'elm']);

gulp.task('default', ['build'], function() {
  gulp.watch('src/less/**/*.less', ['css']);
  gulp.watch('src/elm/**/*.elm', ['elm']);
});
