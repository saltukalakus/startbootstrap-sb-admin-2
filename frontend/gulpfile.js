var gulp = require('gulp');
var shell = require('gulp-shell');
var browserify = require('gulp-browserify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var dotPacker = require('gulp-dotjs-packer');
var fs = require('fs');
var path = require('path');
var glob = require('glob');

gulp.task('bower', shell.task([
    'bower install'
]));

gulp.task('build', function() {
    glob.sync('./*').forEach(function (filePath) {
        if (fs.statSync(filePath).isDirectory()) {

            var directoryName = path.basename(filePath);

            if (directoryName != 'commons' || directoryName != 'node_modules' || directoryName != 'topbar') {

                // build template js for micro-app
                gulp.src([path.join(filePath, 'templates/*.dot'),
                    path.join(filePath, '../topbar/templates/*.dot')])
                    .pipe(dotPacker({
                        fileName: directoryName + '_templates.js'
                    }))
                    .pipe(gulp.dest(path.join('../public/modules/', directoryName)));

            }

            if (directoryName != 'commons' || directoryName != 'node_modules') {

                // build app.js for micro-app
                gulp.src(path.join(filePath, 'app.js'))
                    .pipe(browserify({
                        insertGlobals : true,
                        debug : !gulp.env.production
                    }))
                    .pipe(gulp.dest(path.join('../public/modules/', directoryName)));
            }
        }
    });

});

gulp.task('lint', function() {
    return gulp.src(['./**/*.js', '!./node_modules/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('install', ['bower',
    'lint',
    'build']);