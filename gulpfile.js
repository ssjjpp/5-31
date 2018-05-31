var gulp = require('gulp');
var sass = require('gulp-sass');
var server = require('gulp-webserver');
var sequence = require('gulp-sequence');
var mincss = require('gulp-clean-css');
var minjs = require('gulp-uglify');
var minhtml = require('gulp-htmlmin');
var rev = require('gulp-rev');
var collector = require('gulp-rev-collector');

gulp.task('css', function() {
    gulp.src('./src/css/*.scss')
        .pipe(sass())
        .pipe(mincss())
        .pipe(rev())
        .pipe(gulp.dest('build/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'))
});

gulp.task('html', function() {
    gulp.src(['rev/**/*.json', 'src/**/*.html'])
        .pipe(collector({
            replaceReved: true
        }))
        .pipe(minhtml())
        .pipe(gulp.dest('build'))
});

gulp.task('js', function() {
    gulp.src('src/js/*.js')
        .pipe(minjs())
        .pipe(gulp.dest('build/js'))
});
gulp.task('server', ['css', 'js', 'html'], function() {
    gulp.src('build')
        .pipe(server({
            port: 9090,
            middleware: function(req, res, next) {
                next()
            }
        }))
});
gulp.task('watch', function() {
    gulp.watch('src/css/*.scss', ['css'])
    gulp.watch('src/js/*.js', ['js'])
    gulp.watch('src/html/*.html', ['html'])
})
gulp.task('default', function(cb) {
    sequence('server', 'watch', cb)
});