module.exports = function(grunt) {
	'use strict';
	grunt.loadNpmTasks('@sap/grunt-sapui5-bestpractice-build');

	// grunt.registerTask('printConfig', function() {
	//   grunt.log.writeln(JSON.stringify(grunt.config.get(["openui5_preload"]), null, 2));
	// });

	grunt.config.init({
		"pkg": {
			"name": "grunt-build",
			"version": "0.0.1",
			"description": "Grunt build",
			"private": true,
			"devDependencies": {
				"@sap/grunt-sapui5-bestpractice-build": "1.3.19"
			}
		},
		"dir": {
			"webapp": "webapp",
			"dist": "dist",
			"root": "com/mii/scanner",
			"tmpDir": "dist/tmp",
			"tmpDirDbg": "dist/tmp-dbg"
		},
		"openui5_preload": {
			"preloadDbg": {
				"options": {
					"resources": {
						"cwd": "dist/tmp-dbg",
						"src": "**/*.js",
						"prefix": "com/mii/scanner"
					},
					"compress": false,
					"dest": "dist/tmp-dbg"
				},
				"components": true
			},
			"preloadTmp": {
				"options": {
					"resources": {
						"cwd": "dist/tmp",
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
							"!libs/**",
							"!test/**",
							"!localService/**"
						],
						"prefix": "com/mii/scanner"
					},
					"compress": false,
					"dest": "dist/tmp"
				},
				"components": true
			}
		},
		"clean": {
			"dist": "dist/"
		},
		"copy": {
			"copyToDbg": {
				"files": [{
					"expand": true,
					"src": [
						"**/*.js",
						"!test/**",
						"!localService/**"
					],
					"dest": "dist/tmp-dbg",
					"cwd": "webapp"
				}, {
					"expand": true,
					"src": "**/*.css",
					"dest": "dist/tmp-dbg",
					"cwd": "webapp"
				}]
			},
			"copyToTmp": {
				"files": [{
					"expand": true,
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
						"!test/**",
						"!localService/**"
					],
					"dest": "dist/tmp",
					"cwd": "webapp"
				}, {
					"expand": true,
					"src": "**/*.css",
					"dest": "dist/tmp",
					"cwd": "webapp"
				}, {
					"expand": true,
					"src": "localService/metadata.xml",
					"dest": "dist/tmp",
					"cwd": "webapp"
				}, {
					"expand": true,
					"src": "**/*",
					"dest": "dist/tmp",
					"cwd": "webapp"
				}]
			},
			"copyDbgToDist": {
				"files": [{
					"expand": true,
					"src": [
						"**/*.js",
						"!test/**",
						"!localService/**"
					],
					"dest": "dist",
					"cwd": "dist/tmp-dbg"
				}, {
					"expand": true,
					"src": "**/*.css",
					"dest": "dist",
					"cwd": "dist/tmp-dbg"
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
					"src": [
						"**/*",
						"!test/**",
						"!localService/**"
					],
					"dest": "dist",
					"cwd": "dist/tmp"
				}]
			}
		},
		"mkdir": {
			"dist": {
				"options": {
					"create": [
						"dist"
					]
				}
			}
		},
		"cssmin": {
			"build": {
				"files": [{
					"expand": true,
					"src": "**/*.css",
					"dest": "dist",
					"cwd": "webapp"
				}]
			}
		},
		"uglify": {
			"uglifyTmp": {
				"files": [{
					"expand": true,
					"src": "**/*.js",
					"dest": "dist/tmp",
					"cwd": "webapp"
				}]
			},
			"uglifyPreload": {
				"files": [{
					"expand": true,
					"src": "dist/tmp/Component-preload.js"
				}]
			}
		},
		"codevalidation": {
			"di.code-validation.js": {
				"options": {
					"projectPath": ".",
					"ignoredPaths": [
						"node_modules",
						"dist"
					],
					"reporter": "problems_reporter",
					"reporterOptions": {
						"outputFile": "dist/di.code-validation.core_issues.json"
					},
					"validators": {
						"@sap/di.code-validation.js": {
							"extensions": [
								".js"
							]
						}
					}
				}
			},
			"di.code-validation.xml": {
				"options": {
					"projectPath": ".",
					"ignoredPaths": [
						"node_modules",
						"dist"
					],
					"reporter": "problems_reporter",
					"reporterOptions": {
						"outputFile": "dist/di.code-validation.core_issues.json"
					},
					"validators": {
						"@sap/di.code-validation.xml": {
							"extensions": [
								".xml"
							]
						}
					}
				}
			}
		}
	});

	grunt.registerTask('default', [
		//"printConfig"
		'lint',
		'clean',
		'build'
	]);

};