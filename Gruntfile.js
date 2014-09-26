module.exports = function (grunt) {

	grunt.initConfig({
		stealBuild: {
			main: {
				options: {
					system: {
						config: __dirname + "/public/js/stealconfig.js",
						main: "main"
					},
					buildOptions: {}
				}
			}
		}
	});

	grunt.loadNpmTasks('steal-tools');

	grunt.registerTask('build', ['stealBuild']);
};
