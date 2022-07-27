const {src, dest, watch, parallel, series} = require('gulp')

//Plagins
const sass          = require('gulp-sass')(require('sass'))
const concat        = require('gulp-concat')
const browserSync   = require('browser-sync').create()
const uglify        = require('gulp-uglify-es').default
const autoprefixer  = require('gulp-autoprefixer')
const imagemin      = require('gulp-imagemin')
const del           = require('del')

function styles() {
    return src('src/scss/styles.scss')

    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 10 version'],
        grid: true
    }))
    .pipe(dest('src'))
    .pipe(browserSync.stream())
}

function scripts() {
    return src('src/js/typeIt.js')

    .pipe(uglify())
    .pipe(concat('index.js'))
    .pipe(dest('src'))
    .pipe(browserSync.stream())
}

function compressImgs() {
    return src('src/assets/images/**/*.*')

    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(dest('dist/assets/images'))
}

function liveServer() {
    browserSync.init({
        server: {
            baseDir: 'src'
        }
    })
}

function watching() {
    watch(['src/scss/**/*.scss'], styles)
    watch('src/index.html').on('change', browserSync.reload)
    watch(['src/js/*.js'], scripts)
}

function cleanDist() {
    return del('dist')
}

function build() {
    return src([
        'src/index.html',
        'src/style.min.css',
        'src/index.js'
    ])

    .pipe(dest('dist'))
}

exports.watching = watching
exports.liveServer = liveServer
exports.compressImgs = compressImgs

exports.default = parallel(watching, liveServer)

exports.build = series(cleanDist, build)