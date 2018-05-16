module.exports = function(grunt) {
	"use strict";

	var http = "https://";
	var url = http + "sapui5.hana.ondemand.com/resources/sap-ui-core.js";

	grunt.loadNpmTasks("@sap/grunt-sapui5-bestpractice-build");
	grunt.loadNpmTasks('grunt-text-replace');

	grunt.file.write("GruntConfig.sap.json", JSON.stringify(grunt.config.get()));

	var oConfig = {
		"openui5_preload": {
			"preloadDbg": {
				"options": {
					"resources": {
						"cwd": "dist/tmp-dbg",
						"src": ["**/*.js", "!**/node_modules/**", "!neo-app.json", "!**/test/**"],
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
						"src": ["**/*.js", "**/changes-bundle.json", "**/*.fragment.html", "**/*.fragment.json", "**/*.fragment.xml", "**/*.view.html", "**/*.view.json", "**/*.view.xml", "**/*.properties", "manifest.json", "!**/node_modules/**", "!neo-app.json", "!**/test/**"],
						"prefix": "com/mii/scanner"
					},
					"compress": true,
					"dest": "dist/tmp"
				},
				"components": true
			},
			"preloadRootProject": {
				"options": {
					"resources": {
						"cwd": "webapp",
						"src": ["**/*.js", "**/*.fragment.html", "**/*.fragment.json", "**/*.fragment.xml", "**/*.view.html", "**/*.view.json", "**/*.view.xml", "!**/node_modules/**", "!neo-app.json", "!**/test/**"],
						"prefix": "com/mii/scanner"
					},
					"compress": false,
					"dest": "webapp"
				},
				"components": true
			}
		},
		"replace": {
			"ext": {
				"src": ['dist/index-ext.irpt'],
				"overwrite": true, // overwrite matched source files
				"replacements": [{
					"from": "../resources/sap-ui-core.js",
					"to": url
				}]
			}
		},
		"copy": {
			"irpt": {
				"files": [{
					"expand": true,
					"src": "index.html",
					"dest": "dist",
					"cwd": "webapp",
					"rename": function(dest, src) {
						return dest + "/" + src.replace(".html", ".irpt");
					}
				}]
			},
			"ext": {
				"files": [{
					"expand": true,
					"src": "index.html",
					"dest": "dist",
					"cwd": "webapp",
					"rename": function(dest, src) {
						return dest + "/" + src.replace(".html", "-ext.irpt");
					}
				}]
			}
		}
	};

	grunt.config.merge(oConfig);

	grunt.file.write("GruntConfig.my.json", JSON.stringify(grunt.config.get()));

	grunt.registerTask("default", [
		"clean",
		"lint",
		"build",
		"copy:irpt",
		"copy:ext",
		"replace:ext"
	]);
};