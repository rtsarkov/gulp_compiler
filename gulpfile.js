'use strict';

var gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    notify = require("gulp-notify"),
    plumber = require("gulp-plumber"),    
    concat = require('gulp-concat'),
    order = require('gulp-order');
    
    var settings = {
        isBitrix: false,
        bitrixTemplate: 'main',
        cssPrefixer: ['last 3 versions'],        
        in_path: './source',
        out_path: './www',
        tasks: [
            // 'html',
            'css',
            // 'images',
            'js',
            // 'style',
            // 'fonts'
        ]
    }
    //Путь к шаблону Bitrix
    if(settings.isBitrix){
        settings.out_path = './www/local/templates/' + settings.bitrixTemplate;
    }
    var path = {
        build: { //Тут мы укажем куда складывать готовые после сборки файлы
            html: settings.out_path + '/',
            js: settings.out_path + '/js/',
            css: settings.out_path + '/css/',
            img: settings.out_path + '/img/',
            fonts: settings.out_path + '/fonts/'
        },
        src: { //Пути откуда брать исходники
            html: settings.in_path + '/html/**/*', //взять все файлы из html
            js: settings.in_path + '/js/**/*.js',//В стилях и скриптах нам понадобятся только main файлы
            style: settings.in_path + '/scss/**/*.scss',
            img: settings.in_path + '/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
            fonts: settings.in_path + '/fonts/**/*.*'
        },
        watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
            html: settings.in_path + '/html/*.html', 
            js: settings.in_path + '/js/**/*.js',
            style: settings.in_path + '/scss/**/*.scss',
            img: settings.in_path + '/img/**/*.*', 
            fonts: settings.in_path + '/fonts/**/*.*'
        },
        clean: './build'
    };
    var config_server = {
        proxy: 'doman.tehnoutlab.ru',
        port: 3000,
        ui_port: 3001 
    };
    /*-----------TASK---------- */
    /*HTML */
    const html = () => {
        if(settings.isBitrix) return true;
        return gulp.src(path.src.html) //Выберем файлы по нужному пути
            .pipe(rigger()) //Прогоним через rigger
            .pipe(gulp.dest(path.build.html)) //Сложим их в папку www
            .pipe(browserSync.stream()); //И перезагрузим наш сервер для обновлений
    };
        // /*STYLE */
    const css = function () {
        return gulp.src(path.src.style) //Выберем наш main.scss
            .pipe(plumber({
                errorHandler: (err) => {
                notify.onError({
                    title: "Ошибка в CSS",
                    message: "<%= error.message %>"
                })(err);
                }
            }))
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
        .pipe(plumber({
            errorHandler: (err) => {
            notify.onError({
                title: "Ошибка в JS",
                message: "<%= error.message %>"
            })(err);
            }
        }))
        .pipe(order([
            "plugins.js",
            "*.js"
        ]))
        .pipe(concat('main.js'))
        // .pipe(rigger()) //Прогоним через rigger
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
    }

    // /*IMG */
    // gulp.task('images:build', () => {
    //     gulp.src(path.src.img) //Выберем наши картинки
    //         .pipe(imagemin({ //Сожмем их
    //             progressive: true,
    //             svgoPlugins: [{removeViewBox: false}],
    //             use: [pngquant()],
    //             interlaced: true
    //         }))
    //         .pipe(gulp.dest(path.build.img)) //И бросим в build
    //         .pipe(browserSync.stream());
    // });
    // gulp.task('images:watch', () => {
    //     watch([path.watch.img], (event, cb) => {
    //         gulp.start('image:build');
    //     });
    // });
    /*FONTS */
    // gulp.task('fonts:build', () => {
    //     gulp.src(path.src.fonts)
    //         .pipe(gulp.dest(path.build.fonts))
    // });
    // gulp.task('fonts:watch', () => {
    //     watch([path.watch.fonts], (event, cb) => {
    //         gulp.start('fonts:build');
    //     });
    // });


    /*Watch files */
    const watchFiles = function () {
        if(settings.tasks['html']) gulp.watch(path.watch.html, html);
        if(settings.tasks.indexOf('css') != -1) gulp.watch(path.watch.style, css);
        if(settings.tasks.indexOf('js') != -1) gulp.watch(path.watch.html, js);
        if(settings.tasks['images']) gulp.watch(path.watch.img, images);
        if(settings.tasks['fonts']) gulp.watch(path.watch.fonts, fonts);
    }
    
    const build = gulp.series(
        gulp.parallel([css,js]),
        watchFiles
    );    

    // export tasks
    exports.default = build;   