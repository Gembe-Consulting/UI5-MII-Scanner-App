module.exports = function(grunt) {
	'use strict';

	var oConfig = {
		"openui5_preload": {
			"preloadTmp": {
				"options": {
					"compress": true
				}
			}
		},
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

						if (aVersionParts[2] >= 95) {
							aVersionParts[1] = Number(aVersionParts[1]) + 1;
							aVersionParts[2] = 0;
						} else {
							aVersionParts[2] = Number(aVersionParts[2]) + 5;
						}

						var sNewVersion = aVersionParts[0] + "." + aVersionParts[1] + "." + aVersionParts[2];
						sNewVersion = sNewVersion + "." + "<%= grunt.template.today('yyyy-mm-dd') %>";
						grunt.log.writeln("New Version: " + sNewVersion);
						return aParts[0] + "=" + sNewVersion;
					}
				}]
			}
		},
		copy: {
			irpt: {
				files: [{
					"expand": true,
					"src": "index.html",
					"dest": "dist",
					"cwd": "webapp",
					rename: function(dest, src) {
						return dest + "/" + src.replace('.html', '.irpt');
					}
				}]
			}
		}
	};

	grunt.loadNpmTasks('@sap/grunt-sapui5-bestpractice-build');

	grunt.config.merge(oConfig);

	grunt.registerTask('default', [
		'lint',
		'clean',
		'build',
		'copy:irpt'
	]);

};