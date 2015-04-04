var gulp = require('gulp');
var path = require('path');
var filter = require('gulp-filter');

var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');

// Less CSS Plugins
var LessPluginCleanCSS = require("less-plugin-clean-css"),
	cleancss = new LessPluginCleanCSS({advanced: true});

var LessPluginAutoPrefix = require('less-plugin-autoprefix'),
	autoprefix= new LessPluginAutoPrefix({browsers: ["last 2 versions"]});

var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');

var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');

var mainBowerFiles = require('main-bower-files');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var rename = require("gulp-rename");
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');


/*
   Private Tasks
   ========================================================================== */

// Styles

gulp.task('less', function() {
	gulp.src('./styles/main.less')
		.pipe(sourcemaps.init())
		.pipe(less({
			plugins: [autoprefix, cleancss],
			// Where should compiler look for @import files
			paths: [
				path.join(__dirname, 'styles', 'modules'),
				path.join(__dirname, 'styles', 'partials')
			]
		}))
		.pipe(sourcemaps.write())			// create the sourcemaps
		.pipe(gulp.dest('./public/styles')) 	// write css file
		.pipe(reload({ stream:true })); 	// reload the css in the browser
});

// Templates

gulp.task('handlebars', function() {
	gulp.src('views/**/*.hbs')
		.pipe(handlebars())
		.pipe(wrap('Handlebars.template(<%= contents %>)'))
		.pipe(declare({
			namespace: 'templates',
			noRedeclare: true, // Avoid duplicate declarations
		}))
		.pipe(concat('templates.js'))
		.pipe(gulp.dest('public/scripts/'));
});

// Scripts

gulp.task('jscs', function() {
	gulp.src('scripts/main.js')
		.pipe(jscs());
});

gulp.task('lint', function() {
	gulp.src('scripts/*.js')
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'));
});

gulp.task('scripts', function() {
	gulp.src('scripts/main.js')
		.pipe(jscs())
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/scripts'))
});

gulp.task('bower', function() {
	// js
	gulp.src(mainBowerFiles())
		.pipe(filter('*.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/scripts/vendor'))
		// exclude jquery and modernizr from being in the plugins js
		.pipe(filter(['*', '!modernizr.*', '!jquery.*']))
		.pipe(concat('plugins.js'))
		.pipe(gulp.dest('public/scripts/vendor'));

	// css
	gulp.src(mainBowerFiles())
		.pipe(filter('*.css'))
		.pipe(cssmin())
		.pipe(gulp.dest('public/styles/vendor'))
		// exclude normalize from being in the plugins css
		.pipe(filter(['*', '!normalize.*']))
		.pipe(concat('plugins.css'))
		.pipe(gulp.dest('public/styles/vendor'));
});

gulp.task('iconfont', function() {
	var fontName = 'myfont';

	gulp.src(['images/fonts/*.svg'])
		.pipe(iconfont({
			fontName: fontName, // required
			appendCodepoints: true // recommended option
		}))
		.on('codepoints', function(codepoints, options) {
			var options = {
				glyphs: codepoints,
				fontName: fontName,
				fontPath: '../fonts/'+fontName+'/',
				className: 'icon'
			};

			gulp.src('styles/partials/font-template.css')
				.pipe(consolidate('lodash', options))
				.pipe(rename({ basename:fontName }))
				.pipe(gulp.dest('styles/partials/'));

			// if you don't need sample.html, remove next 4 lines
			gulp.src('icon-font-render-tmpl.html')
				.pipe(consolidate('lodash', options))
				.pipe(rename({ basename:fontName }))
				.pipe(gulp.dest('./')); // set path to export your sample HTML
		})
		.pipe(gulp.dest('public/fonts/'+fontName));
});

gulp.task('watch', function() {
	browserSync({
		server: {
			baseDir: './'
		}
	});

	gulp.watch('styles/*.less', ['less']);
	gulp.watch('scripts/*.js', ['jscs', 'lint']);
	gulp.watch('views/*.hbs', ['handlebars']);
});

/*
   Public Tasks
   ========================================================================== */

gulp.task('prod', function() {

});

gulp.task('default', [
	'watch',
	'bower',
	'scripts',
	'iconfont',
	'less',
	'handlebars'
]);