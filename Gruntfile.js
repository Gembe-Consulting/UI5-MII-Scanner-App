module.exports = function(grunt) {
	'use strict';

	var config = {
		replace: {
			version: {
				src: ['webapp/i18n/i18n.properties'],
				overwrite: true, // overwrite matched source files
				replacements: [{
					from: "appVersion=@@current version@@",
					to: "appVersion=1.0.63.201801282013"
				}]
			}
		}
	};

	grunt.loadNpmTasks('@sap/grunt-sapui5-bestpractice-build');

	grunt.config.merge(config);

	grunt.loadNpmTasks('grunt-text-replace');

	grunt.registerTask('default', [
		'replace',
		'lint',
		'clean',
		'build'
	]);

};