module.exports = function(grunt) {
	"use strict";

	grunt.loadNpmTasks("@sap/grunt-sapui5-bestpractice-build");
	grunt.loadNpmTasks('grunt-text-replace');

	var oConfig = {
		"openui5_preload": {
			"preloadTmp": {
				"options": {
					"resources": {
						"cwd": "dist/tmp",
						"src": ["**/*.js", "**/*.fragment.html", "**/*.fragment.json", "**/*.fragment.xml", "**/*.view.html", "**/*.view.json", "**/*.view.xml", "**/*.properties", "manifest.json", "!test/**", "!**/node_modules/**", "!neo-app.json"],
						"prefix": "com/mii/scanner"
					},
					"compress": true,
					"dest": "dist/tmp"
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
					"to": "https://" + "sapui5.hana.ondemand.com/resources/sap-ui-core.js"
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

	grunt.registerTask("default", [
		"clean",
		"lint",
		"build",
		"copy:irpt",
		"copy:ext",
		"replace:ext"
	]);
};