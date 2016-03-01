var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

gulp.task('default', function () {
    console.log('Gulp tasks: `concat`, `compress`, `cordova`, `web`');
});

gulp.task('concat', function () {
    var src = [
        'src/objects/*.js',
        'src/data/*.js',
        'src/lib/*.js',
        'src/scenes/*.js'
    ];
    return gulp.src(src).pipe(concat('nonogram-madness.js'))
                        .pipe(gulp.dest('dist'));
});


gulp.task('compress', function () {
    // TODO: source map
    return gulp.src('dist/nonogram-madness.js')
               .pipe(uglify())
               .pipe(rename('nonogram-madness.min.js'))
               .pipe(gulp.dest('dist'));
});

gulp.task('cordova', ['concat', 'compress'], function () {
    gulp.src(['dist/nonogram-madness.min.js'], { base: 'dist' })
        .pipe(gulp.dest('cordova/www/javascript'));

    gulp.src(['node_modules/arcadia/dist/arcadia.js'], { base: 'node_modules/arcadia/dist' })
        .pipe(gulp.dest('cordova/www/javascript'));

    gulp.src(['node_modules/sona/dist/sona.js'], { base: 'node_modules/sona/dist' })
        .pipe(gulp.dest('cordova/www/javascript'));

    gulp.src(['assets/**'])
        .pipe(gulp.dest('cordova/www/assets'));
});

gulp.task('web', ['concat', 'compress'], function () {
    gulp.src(['dist/nonogram-madness.min.js'], { base: 'dist' })
        .pipe(gulp.dest('../../websites/ganbarugames.com/nonogram/javascript'));

    gulp.src(['node_modules/arcadia/dist/arcadia.js'], { base: 'node_modules/arcadia/dist' })
        .pipe(gulp.dest('../../websites/ganbarugames.com/nonogram/javascript'));

    gulp.src(['node_modules/sona/dist/sona.js'], { base: 'node_modules/sona/dist' })
        .pipe(gulp.dest('../../websites/ganbarugames.com/nonogram/javascript'));

    gulp.src(['assets/**'])
        .pipe(gulp.dest('../../websites/ganbarugames.com/nonogram/assets'));

    gulp.src(['dist/index.html'], { base: 'dist' })
        .pipe(gulp.dest('../../websites/ganbarugames.com/nonogram'));

    // Copy appcache/webapp manifests
    // gulp.src(['dist/manifest.appcache'], { base: 'dist' })
    //     .pipe(gulp.dest('../../websites/ganbarugames.com/nonogram'));

    gulp.src(['manifest.json'])
        .pipe(gulp.dest('../../websites/ganbarugames.com/nonogram'));
});
