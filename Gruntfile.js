module.exports = function(grunt) {
		'use strict';
		grunt.loadNpmTasks('grunt-string-replace');
		grunt.loadNpmTasks('@sap/grunt-sapui5-bestpractice-build');

		grunt.file.write("SAPGruntConfig", JSON.stringify(grunt.config(), null, 2));

		'version-replace': {
			inline: {
				files: {
					'i18n/': 'webapp/i18n/i18n.properties',
				},
				options: {
					replacements: [
						// place files inline example
						{
							pattern: 'appVersion=@@current version@@',
							replacement: 'appVersion=1.0.63.201801282013'
						}
					]
				}
			}

			grunt.registerTask('updateVersion', ['version-replace']);

			grunt.config.merge({
				"openui5_preload": {
					"preloadDbg": {
						"options": {
							"resources": {
								"src": [
									"**/*.js",
									"!**/node_modules/**",
									"!neo-app.json"
								]
							}
						}
					},
					"preloadTmp": {
						"options": {
							"resources": {
								"src": [
									"**/*.js",
									"**/*.fragment.html",
									"**/*.fragment.json",
									"**/*.fragment.xml",
									"**/*.view.html",
									"**/*.view.json",
									"**/*.view.xml",
									"**/*.properties",
									"manifest.json",
									"!**/node_modules/**",
									"!neo-app.json"
								]
							}
						}
					},
					"preloadRootProject": {
						"options": {
							"resources": {
								"src": [
									"**/*.js",
									"**/*.fragment.html",
									"**/*.fragment.json",
									"**/*.fragment.xml",
									"**/*.view.html",
									"**/*.view.json",
									"**/*.view.xml",
									"!**/node_modules/**",
									"!neo-app.json"
								]
							}
						}
					}
				},
				"copy": {
					"copyToDbg": {
						"files": [{
							"src": [
								"**/*.js",
								"!neo-app.json",
								"!**/node_modules/**"
							]
						}]
					},
					"copyToTmp": {
						"files": [{
							"src": [
								"**/*.js",
								"**/*.fragment.html",
								"**/*.fragment.json",
								"**/*.fragment.xml",
								"**/*.view.html",
								"**/*.view.json",
								"**/*.view.xml",
								"**/*.properties",
								"manifest.json",
								"!**/node_modules/**",
								"!neo-app.json"
							]
						}]
					},
					"copyDbgToDist": {
						"files": [{
							"src": [
								"**/*.js",
								"!neo-app.json",
								"!**/node_modules/**"
							]
						}]
					},
					"copyTmpToDist": {
						"files": [{
							"expand": true,
							"src": "Component-preload.js",
							"dest": "dist",
							"cwd": "dist/tmp"
						}, {
							"expand": true,
							"src": "**/*",
							"dest": "dist",
							"cwd": "dist/tmp"
						}]
					}
				}
			});

			grunt.file.write("CUSTGruntConfig", JSON.stringify(grunt.config(), null, 2));

			grunt.registerTask('default', [
				'updateVersion',
				'lint',
				'clean',
				'build'
			]);

		};