gulp       = require 'gulp'
browserify = require 'gulp-browserify'
rename     = require 'gulp-rename'
watch      = require 'gulp-watch'
plumber    = require 'gulp-plumber'
uglify     = require 'gulp-uglify'

gulp.task 'coffee', ->
  gulp
    .src 'index.coffee', read: false
    .pipe plumber()
    .pipe browserify
      transform: ['coffeeify']
      extensions: ['.coffee']
      debug: true
    .pipe uglify()
    .pipe rename 'vendor.js'
    .pipe gulp.dest ''

gulp.task 'default', ['coffee']
