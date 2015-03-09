var gulp = require('gulp');
var deploy = require('gulp-gh-pages');

gulp.task('deploy', function () {
    return gulp.src(["dist/**/*.*", "dist/*"])
        .pipe(deploy({
          origin: 'github'
          // remoteUrl: 'git@github.com:emmahu/weatherapp.git'
        }));
});
