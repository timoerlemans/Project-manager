var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    rev = require('gulp-rev'),
    del = require('del'),
    fs = require('fs'),
    CssFolder = './assets/css',
    JsFolder = './assets/js',
    inputCss = CssFolder + '/**/*.scss',
    inputJs = JsFolder + '/**/*.js';

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded',
};

handleError = function(taskName, msg) {
    return plumber({
        errorHandler: notify.onError({
            title: taskName,
            message: 'Error: ' + msg,
        }),
    });
};

handleSuccess = function(taskName, msg) {
    return notify({
        title: taskName,
        message: 'Success: ' + msg,
    });
};

gulp.task('sass', function() {
    return gulp
        .src(CssFolder + '/styles.scss')
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.init())
        .pipe(cssnano())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(CssFolder))
        .pipe(handleSuccess('sass', 'SASS compiling succeeded'));
});

var group = require('gulp-group-files'),
    jsGroups = JSON.parse(fs.readFileSync(JsFolder + '/groups.json', 'utf8'))
        .groups;

gulp.task('clean:js', function() {
    del([JsFolder + '/build/*']);
});

gulp.task(
    'jsconcat',
    ['clean:js'],
    group(jsGroups, function(name, files) {
        return gulp
            .src(files)
            .pipe(handleError('jsconcat', 'JS concatenation failed'))
            .pipe(sourcemaps.init())
            .pipe(concat(name + '.js'))
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(JsFolder + '/build'))
            .pipe(handleSuccess('jsconcat', 'JS concatenation succeeded'));
    })
);

gulp.task('js', ['jsconcat'], function() {
    return gulp
        .src(JsFolder + '/build/*.js')
        .pipe(handleError('js', 'JS manifest generation failed'))
        .pipe(rev())
        .pipe(gulp.dest(JsFolder + '/build'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(JsFolder + '/build'))
        .pipe(handleSuccess('js', 'JS manifest generation succeeded'));
});

gulp.task('watch', function() {
    gulp.watch(inputCss, ['sass']);
    gulp.watch(
        [
            JsFolder + '/**/*.js',
            '!' + JsFolder + '/build/**/*',
            '!' + JsFolder + '/tasks/**/*.js',
        ],
        ['js']
    );
});

gulp.task('default', ['sass', 'js', 'watch']);
