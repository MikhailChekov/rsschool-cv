/* ------------------- Path  ------------------ */

const project_folder = 'dist',
  source_folder = 'src';

const path = {
  build: {
    html: `${project_folder}/`,
    css: `${project_folder}/css`,
    js: `${project_folder}/js`,
    img: `${project_folder}/img/`,
    fonts: `${project_folder}/fonts`,
  },

  src: {
    html: [`${source_folder}/*.html`, `${!source_folder} _*.html`],
    css: `${source_folder}/scss/index.scss`,
    js: `${source_folder}/js/index.js`,
    img: `${source_folder}/img/**/*`,
    fonts: `${source_folder}/fonts/**/*`,
  },

  watch: {
    html: `${source_folder}/**/*.html`,
    css: `${source_folder}/**/*.scss`,
    js: `${source_folder}/**/*.js`,
    img: `${source_folder}/img/**/*`,
  },

  clean: `./${project_folder}/`,
};

/* ------------------- Requires  ------------------ */
const { src, dest } = require('gulp'),
  gulp = require('gulp'),
  concat = require('gulp-concat'),
  cleancss = require('gulp-clean-css'),
  scss = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  fileinclude = require('gulp-file-include'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify-es').default,
  fs = require('fs'),
  babel = require('gulp-babel'),
  //old image plugin
  imagemin = require('gulp-imagemin'),
  //new
  image = require('gulp-image');
  browsersync = require('browser-sync').create(),
  del = require('del'),
  //push media-queries to bottom
  gcmq = require('gulp-group-css-media-queries'),
  svgsprite = require('gulp-svg-sprite'),
  //fonts
  ttf2woff = require('ttf2woff'),
  ttf2woff2 = require('ttf2woff2'),
  fonter = require('gulp-fonter'),
  debug = require('gulp-debug'),
  plumber = require('gulp-plumber'),
  notify = require('gulp-notify'),
  beep = require('beepbeep'),
  jslint = require('gulp-jslint'),
  prettyError = require('gulp-prettyerror'),
  webpack = require('webpack'),
  webpackStream = require('webpack-stream');

function browserSync() {
  browsersync.init({
    server: {
      baseDir: `./${project_folder}/`,
    },
    port: 2000,
    notify: false,
  });
}

/* ------------------- Error handler ------------------ */
const onError = function (err) {
  notify.onError({
    title: 'Error in ' + err.plugin,
    message: err.message,
  })(err);
  beep(2);
  this.emit('end');
};

/* ------------------- HTML ------------------ */
function html() {
  return src(path.src.html).pipe(plumber()).pipe(fileinclude()).pipe(dest(path.build.html)).pipe(browsersync.stream());
}

/* ------------------- CSS ------------------ */
//for 1 time execute
function css() {
  return src(path.src.css)
    .pipe(
      plumber({
        errorHandeler: onError,
      })
    )
    .pipe(scss({ outputStyle: 'expanded', errLogToConsole: true }).on('error', scss.logError))
    .pipe(debug({ title: 'sass:' }))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 5 versions'],
        cascade: true,
      })
    )
    .pipe(gcmq())
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

function minifyCss() {
  return src(path.src.css)
    .pipe(plumber())
    .pipe(scss({ outputStyle: 'expanded' }).on('error', scss.logError))
    .pipe(debug({ title: 'sass:' }))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 5 versions'],
        cascade: true,
      })
    )
    .pipe(gcmq())
    .pipe(cleancss())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

/* ------------------- JS ------------------ */

//for 1 time execute
function js() {
  return src(path.src.js)
    .pipe(
      plumber({
        errorHandeler: onError,
      })
    )
    .pipe(concat('index.js'))
    .pipe(
      webpackStream({
        output: {
          filename: 'index.js',
        },
        mode: 'none',
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env'],
                },
              },
            },
          ],
        },
      })
    )
    .pipe(prettyError())
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

function minifyJs() {
  return src(path.src.js)
    .pipe(plumber())
    .pipe(concat('index.js'))
    .pipe(
      webpackStream({
        output: {
          filename: 'index.js',
        },
        mode: 'none',
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env'],
                },
              },
            },
          ],
        },
      })
    )
    .pipe(prettyError())
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

/* ------------------- Images ------------------ */
const minifyImages = () => {
  return src(path.src.img)
    .pipe(plumber())
    .pipe(image({
      pngquant: true,
      optipng: false,
      zopflipng: true,
      jpegRecompress: false,
      mozjpeg: true,
      gifsicle: true,
      svgo: true,
      concurrent: 10,
      quiet: true // defaults to false
    }))
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
};

const minifyImagesOld = () => {
  return src(path.src.img)
    .pipe(plumber())
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLever: 3, //0 - 7
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
};

// check it (never do)
function svg() {
  return gulp
    .src([`${source_folder}/iconsrite/*.svg`])
    .pipe(plumber())
    .pipe(
      svgsprite({
        mode: {
          stack: {
            sprite: '../icons/icons.svg', //sprite file name
          },
        },
      })
    )
    .pipe(dest(path.build.img));
}

/* ------------------- Fonts ------------------ */
// check it (never do)
function fonts(params) {
  return src(path.src.fonts)
    .pipe(plumber())
    .pipe(ttf2woff())
    .pipe(dist(path.build.fonts))
    .pipe(src(path.src.fonts))
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts));
}

// check it (never do)
const fontConnect2File = (cb) => {
  let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
  if (file_content == '') {
    fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
    return fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let c_fontname;
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split('.');
          fontname = fontname[0];
          if (c_fontname != fontname) {
            fs.appendFile(
              source_folder + '/scss/fonts.scss',
              '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n',
              cb
            );
          }
          c_fontname = fontname;
        }
      }
    });
  }
  cb();
};

// check it (never do)
function otf2ttf() {
  return src([`${path.src.fonts}/*.otf`])
    .pipe(plumber())
    .pipe(
      fonter({
        formats: ['ttf'],
      })
    )
    .pipe(dest(`${path.src.fonts}/`));
}

/* ------------------- Clean ------------------ */
//clean dist folder (useless now);
function clean() {
  return del(path.clean);
}

/* ------------------- WATCH ------------------ */
function watchFiles() {
  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.css, minifyCss);
  gulp.watch(path.watch.js, minifyJs);
}

// for employer
//should test, never do
const employer = gulp.parallel(clean, css, js, html, minifyImages);

// for 1 time execute
const minifyAll = gulp.parallel(minifyCss, minifyJs, minifyImages);
exports.minifyAll = minifyAll;
exports.imagesOld = minifyImagesOld;
exports.images = minifyImages;
exports.fonts = fonts;
exports.otf2ttf = otf2ttf;
exports.fontConnect2File = fontConnect2File;

// working to default
const build = gulp.series(gulp.parallel(minifyCss, minifyJs, html));
const def = gulp.parallel(build, watchFiles, browserSync);

exports.default = def;
