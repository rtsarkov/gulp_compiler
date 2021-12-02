'use strict';

const gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),    
    sass = require('gulp-sass'),
    sourceMaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-minify-css'),
    include = require('gulp-include'),
    notify = require("gulp-notify"),
    plumber = require("gulp-plumber"),
    concat = require('gulp-concat'),
    scssGlob = require('gulp-sass-glob'),
    babel = require('gulp-babel'),
    gulpIf = require('gulp-if'),
    yargs = require('yargs'),
    hideBin = require('yargs/helpers').hideBin,
    minify = require('gulp-minify'),
    svgSprite = require('gulp-svg-sprite');


const argv = yargs(hideBin(process.argv)).argv;
const mode = argv.dev == 1 ? 'development' : 'production';    
const settings = {
    isBitrix: false,
    bitrixTemplate: 'main',
    cssPrefixer: ['last 3 versions'],
    in_path: './app',
    out_path: './www'
};
const path = {
    build: {
        js: settings.out_path + '/js/',
        css: settings.out_path + '/',
        fonts: settings.out_path + '/fonts/',
        svg: settings.out_path + '/images/svg/'
    },
    src: { //Пути откуда брать исходники
        js: settings.in_path + '/js/**/*.js',
        style: settings.in_path + '/scss/**/*.scss',
        fonts: settings.in_path + '/fonts/**/*.{woff,woff2}',
        svg: settings.in_path + '/svg/*.svg'
    }
};

const css = () => {
    return gulp.src(path.src.style)
        .pipe(sourceMaps.init())
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
        .pipe(sass())
        .pipe(prefixer({
            browsers: settings.prefixer
        }))
        .pipe(gulpIf(mode == 'production', cssmin()))
        .pipe(gulpIf(mode == 'development', sourceMaps.write()))
        .pipe(gulp.dest(path.build.css))
};

const js = () => {
    return gulp.src([
        'app/js/plugins.js',
        path.src.js
    ])
    .pipe(sourceMaps.init())
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
    .pipe(minify({
        ext: {
            src: '.js',
            min: '.min.js'
        }
    }))
    .pipe(gulpIf(mode == 'development', sourceMaps.write()))
    .pipe(gulp.dest(path.build.js))
}
const svg = () => {
    return gulp.src(path.src.svg)
        .pipe(svgSprite({
                svg: {
                    xmlDeclaration: false,
                    doctypeDeclaration: false,
                    namespaceIDs: false,
                    dimensionAttributes: false
                },
                mode: {
                    stack: {
                        sprite: "../sprite.svg"
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

const watchFiles = function () {
    gulp.watch(path.src.style, css);
    gulp.watch(path.src.js, js);
    gulp.watch(path.src.svg, svg);
    gulp.watch(path.src.fonts, fonts);
}

exports.build = gulp.series(
    gulp.parallel([css, js, svg, fonts])    
);

exports.default = gulp.series(
    gulp.parallel([css, js, svg, fonts]),
    watchFiles
);
