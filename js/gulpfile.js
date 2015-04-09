// Dependencies
var gulp = require("gulp"),
	uglify = require("gulp-uglify"),
	concat = require("gulp-concat"),
	notify = require("gulp-notify"),
	karma = require("karma").server;

gulp.task("test", function (done) {
	karma.start({
		configFile: process.cwd() + "/src/karma.conf.js"
	}, done);
});


// Concatenate Vendor
gulp.task("concat-vendor", function () {
	gulp.src("src/vendor/*.js")
		.pipe(concat("vendor.js"))
		.pipe(gulp.dest("src/build"))
		.pipe(notify("Vendors successfully concatenated!"));
});

// Concat UI dependencies
var jsConcat = function (name) {
	gulp.src("src/" + name + "/**/*.js")
		.pipe(concat(name + ".js"))
		.pipe(uglify())
		.pipe(gulp.dest("src/build"))
		.pipe(notify(name + ".js successfully concatenated!"));
};

// Concatenate Sections
gulp.task("concat-inc", function () {
	jsConcat("inc");
});

// Concatenate all resources into a single ui.js file
gulp.task("concat-all", function () {
	gulp.src([
		"src/build/vendor.js",
		"src/build/inc.js",
		"src/ui.js"
	])
		.pipe(concat("ui.min.js"))
		.pipe(gulp.dest("src"))
		.pipe(notify("ui.js successfully concatenated!"));
});

// Watch directories and execute assigned tasks
gulp.task("watch", function () {
	gulp.watch("src/vendor/*.js", ["concat-vendor"]);
	gulp.watch("src/inc/**/*.js", ["concat-inc"]);
	gulp.watch(["src/build/*.js", "src/ui.js"], ["concat-all", "test"]);
});

gulp.task("default", function () {
	gulp.start("watch");
});