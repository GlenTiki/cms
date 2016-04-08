var gulp = require('gulp')
var browserify = require('browserify')
var babelify = require('babelify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var del = require('del')
var opn = require('opn')
var isDist = (process.argv.indexOf('serve') === -1)
if (isDist) process.env.NODE_ENV = 'production'
var server
// console.log(process.env)
// if (isDist) console.log = function () {}

gulp.task('js', ['clean:js'], (done) => {
  browserify({
    entries: './public/js/index.js',
    sourceType: 'module',
    debug: false,
    transform: [babelify]
  }).bundle()
    .on('end', done)
    .on('error', (err) => {
      console.warn('Error building bundle.\n', err)
      done()
    })
    .pipe(source('build.js')) // gives streaming vinyl file object
    .pipe(buffer())
    .pipe(gulp.dest('public'))
})

gulp.task('clean:js', (done) => {
  del('public/build.js', done)
})

gulp.task('connect', ['build'], (done) => {
  server = require('./index.js')
  server.create(function(host, port){
    console.log('listening on', host, port)
    done()
  })
})

gulp.task('reconnect', (done) => {
  server.stop(() => {
    // clear the cache...
    Object.keys(require.cache).forEach(function (key) { if (key.indexOf('node_modules') < 0) delete require.cache[key] })
    try {
      server = require('./index.js')

      server.create(done)
    } catch (err) {
      console.warn('Problem parsing server code.\n', err, err.stack)
      done()
    }
  })
})

gulp.task('open', ['connect'], (done) => {
  opn('http://localhost:3000', done)
})

gulp.task('watch', () => {
  gulp.watch('public/js/**/*.js', ['js'])
  gulp.watch(['index.js', 'lib/**/*.js'], ['reconnect'])
})

gulp.task('build', ['js'])

gulp.task('serve', ['open', 'watch'])

gulp.task('default', ['build'])
