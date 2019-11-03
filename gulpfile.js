var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var gulpSequence = require('gulp-sequence')


// copy and combine css files
gulp.task('css', function(done) {

    let location = 'resources/site/css'

    // concat css
    gulp.src([`${location}/variables.css`, `${location}/calendar.css`, `${location}/custom.css`, `${location}/footer.css`, `${location}/header.css`, `${location}/hero.css`, `${location}/layout.css`, `${location}/site.css`, `${location}/top.css`, `${location}/widgets.css`])
        .pipe(concat('site.all.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(location));

    done()
  
  });


// copy and combine js files
gulp.task('js', function(done) {

    let location = 'resources/site/js'

    // concat js
    gulp.src([`${location}/widgets.js`, `${location}/calendar.js`])
        .pipe(concat('site.all.js'))
        .pipe(gulp.dest(location));
  
    done();
  
  });

// run tasks
gulp.task('default', gulp.parallel('css', 'js'));
