const GULP = require('gulp');
const PLUMBER = require('gulp-plumber');
const BROWSER_SYNC = require('browser-sync');
const BUILD = require('gulp-build');
const GUTIL = require('gulp-util');
const CLEAN = require('gulp-clean');
const ZIP = require('gulp-zip');
const DEL = require('del');
const GULP_SEQUENCE = require('gulp-sequence');
const UGLIFY = require('gulp-uglify-es').default;
const EJSMINIFY = require('gulp-ejsmin');

// Move all the folder from project structure to dist folder//
GULP.task('move', function () {

  var task1 = GULP.src(['./../src/dataSource/*'])
    .pipe(UGLIFY())
    .pipe(GULP.dest('./../dist/excelRead/src/dataSource'));

  var task2 = GULP.src(['./../src/helpers/*'])
    .pipe(UGLIFY())
    .pipe(GULP.dest('./../dist/excelRead/src/helpers'));

  var task3 = GULP.src(['./../src/middleware'])
    .pipe(UGLIFY())
    .pipe(GULP.dest('./../dist/excelRead/src/middleware'));

  var task4 = GULP.src(['./../src/routes/*'])
    .pipe(UGLIFY())
    .pipe(GULP.dest('./../dist/excelRead/src/routes'));

  var task5 = GULP.src(['./../src/server/*'])
    .pipe(UGLIFY())
    .pipe(GULP.dest('./../dist/excelRead/src/server'));

  var task6 = GULP.src(['./../src/services/*'])
    .pipe(UGLIFY())
    .pipe(GULP.dest('./../dist/excelRead/src/services'));

  var task7 = GULP.src(['./../src/utils/**/*'])
    .pipe(GULP.dest('./../dist/excelRead/src/utils'));

  var task8 = GULP.src(['./../src/validators'])
    .pipe(UGLIFY())
    .pipe(GULP.dest('./../dist/excelRead/src/validators'));

  var task9 = GULP.src(['./../src/views/*'])
    .pipe(EJSMINIFY())
    .pipe(GULP.dest('./../dist/excelRead/src/views'));

  var task10 = GULP.src(['./../config/**/*'])
    .pipe(GULP.dest('./../dist/excelRead/config'));

  var task11 = GULP.src(['./../node_modules/**/*'])
    .pipe(GULP.dest('./../dist/excelRead/node_modules'));

  var task12 = GULP.src(['./../*.json'])
    .pipe(GULP.dest('./../dist/excelRead/'));

  var task13 = GULP.src(['./../log-files'])
    .pipe(GULP.dest('./../dist/excelRead'));

  var task14 = GULP.src(['./../.env'])
    .pipe(GULP.dest('./../dist/excelRead/'));

  var task15 = GULP.src(['./../.env.example'])
    .pipe(GULP.dest('./../dist/excelRead/'));





  // merging of all tasks
  return [
    task1,
    task2,
    task3,
    task4,
    task5,
    task6,
    task7,
    task8,
    task9,
    task10,
    task11,
    task12,
    task13,
    task14,
    task15
  ];
});

// CLEAN
GULP.task('clean', function () {
  return DEL('./../dist/**/*', { force: true });
});

// ziping of folder structure
GULP.task('zip', () =>
  GULP.src('./../dist/**/*')
    .pipe(ZIP('excelRead.zip'))
    .pipe(GULP.dest('./../dist/'))
);

// Sequencing of different taks
GULP.task('sequence1', GULP_SEQUENCE('clean', 'move'));
//GULP.task('sequence2',GULP_SEQUENCE('sequence1','ZIP'));

// BUILD the project
GULP.task("build", ['sequence1']);

GULP.task('bs-reload', function () {
  BROWSER_SYNC.reload();
});

GULP.task('scripts', function () {
  return GULP.src('*.js')
    .pipe(PLUMBER({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
      }
    }))
    .pipe(concat('main.js'))
    .pipe(GULP.dest('scripts/'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(UGLIFY())
    .pipe(GULP.dest('scripts/'))
    .pipe(BROWSER_SYNC.reload({ stream: true }))
});