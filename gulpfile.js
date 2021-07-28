'use strict';

var gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    include = require('gulp-include'),
    browserSync = require("browser-sync"),
    notify = require("gulp-notify"),
    plumber = require("gulp-plumber"),    
    concat = require('gulp-concat'),
    scssGlob = require('gulp-sass-glob'),
    babel = require('gulp-babel'),
    svgSprite = require('gulp-svg-sprite'),
    order = require('gulp-order');
    
var settings = {
    isBitrix: false,
    bitrixTemplate: 'main',
    cssPrefixer: ['last 3 versions'],        
    in_path: './source',
    out_path: './www'        
}
//Путь к шаблону Bitrix
if(settings.isBitrix){
    settings.out_path = '../local/templates/' + settings.bitrixTemplate;
}
var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: settings.out_path + '/',
        js: settings.out_path + '/js/',
        css: settings.out_path + '/',
        img: settings.out_path + '/img/',
        fonts: settings.out_path + '/fonts/',
        svg: settings.out_path + '/images/svg/'
    },
    src: { //Пути откуда брать исходники
        html: settings.in_path + '/html/**/*', //взять все файлы из html
        js: settings.in_path + '/js/**/*.js',//В стилях и скриптах нам понадобятся только main файлы
        style: settings.in_path + '/scss/**/*.scss',
        img: settings.in_path + '/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: settings.in_path + '/fonts/**/*.{woff,woff2}',
        svg: settings.in_path + '/svg/*.svg'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: settings.in_path + '/html/*.html', 
        js: settings.in_path + '/js/**/*.js',
        style: settings.in_path + '/scss/**/*.scss',
        img: settings.in_path + '/img/**/*.*', 
        fonts: settings.in_path + '/fonts/**/*.{woff,woff2}',
        svg: settings.in_path + '/svg/*.svg'
    },
    clean: './build'
};
/*-----------TASK---------- */
// /*STYLE */
const css = function () {
    return gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(include())
        .pipe(plumber({
            errorHandler: (err) => {
                notify.onError({
                    title: "Ошибка в CSS",
                    message: "<%= error.message %>"
                })(err);
            }
        }))
        .pipe(scssGlob())
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer({
            browsers: settings.prefixer
        })) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build
};
/*JS */
const js = () => {
    return gulp.src(path.src.js) //Найдем наш main файл
    .pipe(order([
        "plugins.js",
        "*.js"
    ]))
    .pipe(plumber({
        errorHandler: (err) => {
        notify.onError({
            title: "Ошибка в JS",
            message: "<%= error.message %>"
        })(err);
        }
    }))
    .pipe(include())
    .pipe(babel({
        presets: ['@babel/preset-env']
    }))
    .pipe(concat('main.js'))
    // .pipe(rigger()) //Прогоним через rigger
    .pipe(sourcemaps.init()) //Инициализируем sourcemap
    .pipe(uglify()) //Сожмем наш js
    .pipe(sourcemaps.write()) //Пропишем карты
    .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
}
const svg = () => {
    return gulp.src(path.src.svg)
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../sprite.svg"  //sprite file name
                }
            },
        }
    ))
    .pipe(gulp.dest(path.build.svg));
}
const fonts = () => {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
}

/*Watch files */
const watchFiles = function () {
    gulp.watch(path.watch.style, css);
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.svg, svg);
    gulp.watch(path.watch.fonts, fonts);
}

const build = gulp.series(
    gulp.parallel([css, js, svg, fonts]),
    watchFiles
);    

// export tasks
exports.default = build;   