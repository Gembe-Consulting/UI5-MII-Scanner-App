module.exports = function(grunt) {
	"use strict";

	var oConfig = {
		openui5_preload: {
			preloadTmp: {
				option: {
					compress: true
				}
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
						return dest + "/" + src.replace(".html", ".irpt");
					}
				}]
			}
		}
	};

	grunt.loadNpmTasks("@sap/grunt-sapui5-bestpractice-build");

	grunt.config.merge(oConfig);

	grunt.registerTask("default", [
		"lint",
		"clean",
		"build",
		"copy:irpt"
	]);

};