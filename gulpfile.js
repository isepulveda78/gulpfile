const  {src, dest, series, parallel, watch} = require('gulp')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')(require('sass'))
const del = require('del')
const origin = 'src'
const destination = 'build'
const babel = require('gulp-babel')
const concatenate = require('gulp-concat')

sass.compiler = require('node-sass')

//del deletes the build folder
async function clean(cb){
    await del(destination)
    cb
}
//Moves html files to a build folder
function html(cb){
    src(`${origin}/**/*.html`).pipe(dest(destination))
    cb()
}
//Moves css files to a build folder
function css(cb){
    src(`${origin}/css/**/*.css`).pipe(dest(`${destination}/css`))
    src(`${origin}/css/style.scss`)
    .pipe(sass({ outputStyle: 'compressed'}))
    .pipe(dest(`${destination}/css`))
    cb()
}
//Moves js files to a build folder
function js(cb){
    src(`${origin}/js/*.js`)
    .pipe(babel({
        compact: false,
        presets: ['@babel/env']})
        )
    .pipe(concatenate('build.js'))
    .pipe(dest(`${destination}/js`))
    cb()
}

function watcher(cb){
    watch(`${origin}/**/*.html`).on('change', series(html, browserSync.reload))
    watch(`${origin}/**/*.scss`).on('change', series(css, browserSync.reload))
    watch(`${origin}/**/*.js`).on('change', series(js, browserSync.reload))
    cb()
}

function server(cb){
    browserSync.init({
        notify: false, //stops from showing the browsersync tab that's on the upper right side
        open: false, //stops from opening a new tab
        server: {
            baseDir: destination
        }
    })
    cb()
}

exports.default = series(clean, parallel(html, css, js), server, watcher)