'use strict';

const gulp = require('gulp'),
      sass = require('gulp-sass'),
      include = require('gulp-html-tag-include'),
      imagemin = require('gulp-imagemin'),
      babel = require('gulp-babel'),
      concat = require('gulp-concat'),
      uglify = require('gulp-uglify'),
      portfinder = require('portfinder'),
      plumber = require('gulp-plumber'),
      browserSync = require('browser-sync'),
      reload = browserSync.reload;

const paths = {
  styles: 'src/styles/',
  css: 'dist/css/',
  images: 'src/images/',
  img: 'dist/img/',
  scripts: 'src/scripts/',
  js: 'dist/js/',
  templates: 'src/templates/',
  html: 'dist/',
};

// Одноразовая сборка проекта
gulp.task('default', function() {
  gulp.start('templates', 'styles', 'images', 'scripts');
});

// Запуск живой сборки
gulp.task('live', function() {
  gulp.start('templates', 'styles', 'images', 'scripts', 'watch', 'server');
});

// Следим за изменениями файлов
gulp.task('watch', function() {
  gulp.watch(paths.templates + '**/*.html', ['templates']);
  gulp.watch(paths.styles + '**/*.scss', ['styles']);
  gulp.watch(paths.scripts + '*.js', ['scripts']);
  gulp.watch(paths.images + '/**/*.{png,jpg,gif,svg}', ['images']);
});

// Собираем HTML
gulp.task('templates', function() {
  gulp.src(paths.templates + '*.html')
    .pipe(include())
    .pipe(plumber({errorHandler: onError}))
    .pipe(gulp.dest(paths.html))
    .pipe(reload({stream: true}));
});

// Собираем SASS
gulp.task('styles', function() {
  return gulp.src(paths.styles + 'main.scss')
    .pipe(sass({
      outputStyle: 'compressed',
      errLogToConsole: true
    }).on('error', onError))
    .pipe(gulp.dest(paths.css))
    .pipe(reload({stream: true}));
});

// Оптимизируем картинки
gulp.task('images', function() {
  return gulp.src(paths.images + '/**/*.{png,jpg,gif,svg}')
    .pipe(imagemin())
    .pipe(gulp.dest(paths.img));
});

// Собираем JS
gulp.task('scripts', function() {
  gulp.src(paths.scripts + '*.js')
    .pipe(plumber({errorHandler: onError}))
    .pipe(babel())
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js));
});

// Локальный сервер
gulp.task('server', function() {
  portfinder.getPort(function(err, port) {
    browserSync({
      server: {
        baseDir: "dist/",
        serveStaticOptions: {
          extensions: ['html']
        }
      },
      host: 'localhost',
      notify: false,
      port: port
    });
  });
});

// Обновление страниц
gulp.task('html', function() {
  gulp.src(paths.html + '*.html')
    .pipe(reload({stream: true}));
});

// Ошибки
const onError = function(error) {
  gutil.log([
    (error.name + ' in ' + error.plugin).bold.red,
    '',
    error.message,
    ''
  ].join('\n'));
  gutil.beep();
  this.emit('end');
};
