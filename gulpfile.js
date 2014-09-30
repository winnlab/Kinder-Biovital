var gulp = require('gulp');
var rimraf = require('gulp-rimraf');
var replace = require('gulp-replace');

gulp.task('prod', function(){
    var data = gulp.src(['./public/js/dist/user/req.config.js']);

    gulp.src('./public/js/dist/user/req.config.js', {read: false})
        .pipe(rimraf());

    data
        .pipe(replace(/\/app\//g, '/dist/'))
        .pipe(gulp.dest('./public/js/dist/user'));
});
