"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); //Crea un servidor de desarrollo local
var open = require('gulp-open'); //Abre una URL en el navegador
var browserify = require('browserify'); //Empaqueta nuesto JS
var reactify = require('reactify'); // Transdorma React JSX en JS
var source = require('vinyl-source-stream'); //Permite usar texto convencional en Gulp

var config = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html',
        js: './src/**/*.js',
        dist: './dist',
        mainJs: './src/main.js'
    }
};

//Inicia el servidor de desarrollo local
gulp.task('connect', function () {
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

//Abre la pagina en el navegador
gulp.task('open', ['connect'], function () {
    gulp.src('dist/index.html')
        .pipe(open({uri: config.devBaseUrl + ':' + config.port + '/'}));
});

//Procesa los archivos html de src y los envia a dist
gulp.task('html', function () {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload());
});

gulp.task('js', function () {
    browserify(config.paths.mainJs)
        .transform(reactify)
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.dist + '/scripts'))
        .pipe(connect.reload());
});

//Revisa si hay cambios en los archivos para actualizar el navegador
gulp.task('watch', function () {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js']);
});

//Comando default, llama a los demas
gulp.task('default', ['html', 'js', 'open', 'watch']);