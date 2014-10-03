var gulp = require('gulp');
var rimraf = require('gulp-rimraf');
var replace = require('gulp-replace');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');

gulp.task('prod', function(){
    var data = gulp.src(['./public/js/dist/user/req.config.js']);

    gulp.src('./public/js/dist/user/req.config.js', {read: false})
        .pipe(rimraf());

    data
        .pipe(replace(/\/app\//g, '/dist/'))
        .pipe(gulp.dest('./public/js/dist/user'));
});

gulp.task('imagemin', function () {
    return gulp.src('public/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest('public/img'));
});
