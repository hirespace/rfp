module.exports = function (config) {
	config.set({
		basePath: ".",

		frameworks: ["jasmine"],

		files: [
			"vendor/*.js",
			"inc/**/*.js",
			"test/*.js"
		],

		exclude: [],

		port: 8001,

		logLevel: config.LOG_INFO,

		autoWatch: false,

		browsers: ["PhantomJS"],

		singleRun: true
	});
};