var gulp = require('gulp'),
    concat = require('gulp-concat'),
    minifyCss = require('gulp-minify-css')

// copy and combine css files
gulp.task('css-app', function(done) {

    let location = 'resources/site/css'

    // concat css
    gulp.src([`${location}/variables.css`, `${location}/custom.css`, `${location}/footer.css`, `${location}/header.css`, `${location}/hero.css`, `${location}/layout.css`, `${location}/site.css`, `${location}/top.css`, `${location}/widgets.css`])
        .pipe(concat('site.all.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(location))

    done()
  
  });


// copy and combine js files
gulp.task('js-app', function(done) {

    let location = 'resources/site/js'

    // concat js
    gulp.src([`${location}/widgets.js`])
        .pipe(concat('site.all.js'))
        .pipe(gulp.dest(location))
  
    done()
  
  });


// copy and combine css files
gulp.task('css-site', function(done) {

    let location = 'site/css'

    // concat css
    gulp.src([`${location}/variables.css`, `${location}/custom.css`, `${location}/footer.css`, `${location}/header.css`, `${location}/hero.css`, `${location}/layout.css`, `${location}/site.css`, `${location}/top.css`, `${location}/widgets.css`])
        .pipe(concat('site.all.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(location))

    done()
  
  });


// copy and combine js files
gulp.task('js-site', function(done) {

    let location = 'site/js'

    // concat js
    gulp.src([`${location}/widgets.js`])
        .pipe(concat('site.all.js'))
        .pipe(gulp.dest(location))
  
    done()
  
  });

// app
gulp.task('default', gulp.parallel('css-app', 'js-app'))

// site
gulp.task('site', gulp.parallel('css-site', 'js-site'))
