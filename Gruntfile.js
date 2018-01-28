module.exports = function(grunt) {
	'use strict';

	var config = {
		replace: {
			version: {
				src: ['webapp/i18n/i18n.properties'],
				overwrite: true, // overwrite matched source files
				replacements: [{
					from: /appVersion=(.*)/g,
					to: function(sCurrentVersion) { // callback replacement

						var aParts = sCurrentVersion.split("=");
						grunt.log.writeln("Current version: " + aParts[1]);

						var aVersionParts = aParts[1].split(".");

						if (aVersionParts[2] >= 9) {
							aVersionParts[1] = Number(aVersionParts[1]) + 1;
							aVersionParts[2] = 0;
						} else {
							aVersionParts[2] = Number(aVersionParts[2]) + 1;
						}

						var sNewVersion = aVersionParts[0] + "." + aVersionParts[1] + "." + aVersionParts[2];
						sNewVersion = sNewVersion + "." + "<%= grunt.template.today('yyyymmdd') %>"
						grunt.log.writeln("New Version: " + sNewVersion);
						return aParts[0] + "=" + sNewVersion;
					}
				}]
			}
		}
	};

	grunt.template.today('yyyymmdd')

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