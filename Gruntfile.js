module.exports = function(grunt) {
	"use strict";

	var oConfig = {
		openui5_preload: {
			preloadTmp: {
				options: {
					compress: true
				}
			}
		},
		replace: {
			extSrc: {
				src: ['dist/index-ext.irpt'],
				overwrite: true, // overwrite matched source files
				replacements: [{
					from: "../resources/sap-ui-core.js",
					to: "https://sapui5.hana.ondemand.com/resources/sap-ui-core.js"
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
						return dest + "/" + src.replace(".html", ".irpt");
					}
				}]
			},
			ext: {
				files: [{
					"expand": true,
					"src": "index.html",
					"dest": "dist",
					"cwd": "webapp",
					rename: function(dest, src) {
						return dest + "/" + src.replace(".html", "-ext.irpt");
					}
				}]
			}
		}
	};
	
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks("@sap/grunt-sapui5-bestpractice-build");

	grunt.config.merge(oConfig);

	grunt.registerTask("default", [
		"lint",
		"clean",
		"build",
		"copy:irpt",
		"copy:ext",
		"replace:extSrc"
	]);

};