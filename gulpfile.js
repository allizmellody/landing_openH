'use strict';

const gulp = require('gulp'),
    argv = require('yargs').argv,
    gulpif = require('gulp-if'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    rigger = require('gulp-rigger'),
    htmlmin = require('gulp-htmlmin'),
    cssmin = require('gulp-minify-css'),
    image = require('gulp-image'),
    rimraf = require('rimraf'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

const path = {
  dist: {
    html: 'dist/',
    js: 'dist/js/',
    css: 'dist/css/',
    img: 'dist/img/',
    fonts: 'dist/fonts/',
    files: 'dist/files'
  },
  src: {
    html: 'src/*.html',
    js: 'src/js/main.js',
    style: 'src/style/main.scss',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*',
    files: 'src/files/**/*.*'
  },
  watch: {
    html: 'src/**/*.html',
    js: 'src/js/**/*.js',
    style: 'src/style/**/*.scss',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*',
    files: 'src/files/**/*.*'
  },
  clean: './dist'
};

const config = {
  server: {
    baseDir: './dist'
  },
  tunnel: true,
  host: 'localhost',
  port: 9000,
  logPrefix: 'devil'
};

gulp.task('js:build', function() {
  gulp.src(path.src.js)
  .pipe(gulpif(argv.prod, uglify()))
  .pipe(gulp.dest(path.dist.js))
  .pipe(reload({ stream: true }));
});

gulp.task('html:build', function() {
  gulp.src(path.src.html)
  .pipe(rigger())
  .pipe(gulpif(argv.prod,
      htmlmin({ collapseWhitespace: true })))
  .pipe(gulp.dest(path.dist.html))
  .pipe(reload({ stream: true }));
});

gulp.task('style:build', function() {
  gulp.src(path.src.style)
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(prefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(gulpif(argv.prod, cssmin()))
  .pipe(gulp.dest(path.dist.css))
  .pipe(reload({ stream: true }));
});

gulp.task('image:build', function() {
  gulp.src(path.src.img)
  .pipe(gulpif(argv.prod,
      image({
        imagemin: true,
        pngquant: true
      })))
  .pipe(gulp.dest(path.dist.img))
});

gulp.task('fonts:build', function() {
  gulp.src(path.src.fonts)
  .pipe(gulp.dest(path.dist.fonts))
});

gulp.task('files:build', function() {
  gulp.src(path.src.files)
  .pipe(gulp.dest(path.dist.files))
});

gulp.task('build', [
  'js:build',
  'html:build',
  'style:build',
  'image:build',
  'fonts:build',
  'files:build'
]);

gulp.task('watch', function() {
  watch([path.watch.js], function() {
    gulp.start('js:build');
  });
  watch([path.watch.html], function() {
    gulp.start('html:build');
  });
  watch([path.watch.style], function() {
    gulp.start('style:build');
  });
  watch([path.watch.img], function() {
    gulp.start('image:build');
  });
  watch([path.watch.fonts], function() {
    gulp.start('fonts:build');
  });

});

gulp.task('webserver', function() {
  browserSync(config);
});

gulp.task('clean', function(cb) {
  rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);