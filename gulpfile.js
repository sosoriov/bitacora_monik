/**
 * Construction and common tasks
 * from the front-end implementation
 * @author Sebastian Osorio / Imdc team
 */

/**
 * Node Modules and Gulp Pipes
 */
var argv = require('yargs').argv,
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    colors = require('colors'),
    concat = require('gulp-concat'),
    merge = require('merge-stream'),
    gulp = require('gulp'),
    gwebpack = require('gulp-webpack'),
    named = require('vinyl-named'),
    path = require('path'),
    reload = browserSync.reload,
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
    // sass = require('gulp-sass'),
    // shelljs = require('shelljs'),
    uglify = require('gulp-uglify'),
    utils = require('./gulp/utils'),
    webpack = require('webpack'),
    // Flags
    production = false
    //true ||
    production = argv.production || argv._.indexOf('production') !== -1

/**
 * Paths
 */
var paths = {
    app: 'app/',
    js: 'app/js/',
    alljs: 'app/js/**/*',
    allcss: 'app/css/**/*',
    public: 'public/',
    html: 'public/**/*.html',
    dist: 'dist/',
    sass: 'app/sass/',
    allsass: 'app/sass/**/*.{sass,scss}',
    npm: 'node_modules/',
    img: 'public/img/**/*',
    font: 'public/font/**/*',
    css: 'public/css/**/*',
  }

var webpackConfig = {
    entry: "./app/js/app.ts",
    output: {
      filename: '[name].js',
    },
    devtool: 'source-map',
    module: {
      loaders: [
        {test: /\.(?:xml|svg|txt)/, exclude: /node_modules/, loader: 'raw'},
        { test: /\.tsx?$/, loader: "ts-loader" } // Typescript loader
      ]
    },
    resolve: {
      root: [ path.join(__dirname, 'app/js') ],
      modulesDirectories: [paths.npm],
      extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    plugins: []
  }

if ( production ) {
  utils.printHeader('ENV: PRODUCTION', 'white', 'bgGreen')
  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({}))
  webpackConfig.devtool = false
} else {
  // webpackConfig.watch = true
  utils.printHeader('ENV: DEVELOPMENT', 'white', 'bgBlue')
}


/**
 * JavaScript Compilation
 */
gulp.task('webpack', function() {
  return gulp.src([ paths.js + '*.js' ])
    .pipe(named())
      .pipe(gwebpack( webpackConfig, webpack ))
      .pipe(gulp.dest( paths.dist + 'js' ))
})

/**
 * Vendor libs
 */
gulp.task('vendor', function() {
  gulp.src([
      paths.components + 'mixpanel/mixpanel.min.js'
    ])
    .pipe(gulp.dest( paths.dist + 'js' ));

  var allStream = gulp.src([
        'jquery/dist/jquery.min.js',
        'bootstrap/dist/js/bootstrap.min.js',
        'angular/angular.min.js',
        'angular-route/angular-route.min.js',
        'angular-animate/angular-animate.min.js',
        'angular-sanitize/angular-sanitize.min.js',
        'angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
        'lodash/lodash.min.js'
        // 'ng-table/dist/ng-table.min.js'
      ].map(toNPMPaths))
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest( paths.dist + 'js' ));


  var minifyStream = gulp.src([
        'fastclick/lib/fastclick.js',
      ].map(toNPMPaths))
      .pipe(uglify({
        preserveComments: 'some'
      }))

  return merge(allStream, minifyStream)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest( paths.dist + 'js' ))
})

/**
 * CSS Compilation
 */

gulp.task('css', function () {
    var stream =  gulp.src([ paths.css ] )
    // .pipe(css({
    //   indentedSyntax: true
    // }))
    // .on('error', swallowError)
    // .pipe(autoprefixer({
    //     browsers: ['last 2 versions'],
    //     cascade: false
    // }))

  if( true || production ){
    var minifyCss = require('gulp-clean-css')
    stream = stream.pipe(minifyCss({
        relativeTo: './node_modules',
        processImport: true
      }))
  }

  return stream
    .pipe(gulp.dest( paths.dist + 'css' ))
    .pipe(reload({ stream:true }))

})


/**
 * Assets
 */
gulp.task('assets', function () {
  return runSequence(
    'img',
    'font',
    'html',
    'css'
    )
})

gulp.task('img', function () {
  return gulp.src(paths.img)
          .pipe(gulp.dest(paths.dist + 'img'))
})

gulp.task('font', function () {
  return gulp.src(paths.font)
          .pipe(gulp.dest(paths.dist + 'font'))
})

gulp.task('html', function () {
  return gulp.src(paths.html)
          .pipe(gulp.dest(paths.dist))
})

/**
 * Watch
 */
gulp.task('watch', function() {
  gulp.watch( paths.css, ['css'])
  gulp.watch( paths.alljs, ['webpack', reload])
  gulp.watch( paths.img, ['img'])
  gulp.watch( paths.font, ['font'])
  gulp.watch( paths.html, ['html'])
})

/**
 * Server
 */
gulp.task('server', ['production'], function() {
    browserSync({
      notify: false,
      server: {
         baseDir: './dist/'
      }
    })
})

/**
 * Production & distribution (same task)
 */
gulp.task('production', ['vendor', 'webpack', 'assets'], function(){})
gulp.task('dist', ['production'], function(){})

gulp.task('default', ['watch', 'server'])

/**
 * Swallow errors preventing the watch to stop
 * @param  {Error} error
 */
function swallowError (error) {
  //If you want details of the error in the console
  console.error( error.toString() )
  this.emit('end')
}



/**
 * Utility functions
 */

/**
 * Converts a path to a full npm path
 * @param  {String} module of the module
 * @return {String}      full path un node_modules
 */
function toNPMPaths (module) {
  return paths.npm + module
}
