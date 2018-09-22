var gulp = require('gulp'),

    sass = require('gulp-sass'),

    ts = require('gulp-typescript'),
    tsProject = ts.createProject('tsconfig.json'),

    path = require('path'),
    fs = require('fs')

var ps = (function () {
    var root = 'src/main/resources/static/';
    return {
        src: root + 'src/',
        dist: root + 'dist/',
        root: root
    }
})();


gulp.task('compileSass', function () {
    return gulp.src('web-resources/style/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/main/resources/static/dist/'));
});


gulp.task('typescript', function () {
    var tsResult = tsProject.src() // or tsProject.src()
        .pipe(tsProject());

    //gulp.dest('src/main/resources/static/js')
    return tsResult.js.pipe(gulp.dest('src/main/resources/static/'));
});

gulp.task('move', function () {
    console.log('asdfasf')
})

gulp.task('default', ['compileSass'], function () {
});