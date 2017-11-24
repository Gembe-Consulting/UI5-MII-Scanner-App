sap.ui.define([
	"sap/ui/test/Opa5",
	"com/mii/scanner/test/arrangement/Common",
	// QUnit additions
	"sap/ui/qunit/qunit-css",
	"sap/ui/qunit/qunit-junit",
	"sap/ui/qunit/qunit-coverage",
	// Page Objects
	"com/mii/scanner/test/pages/Login"
], function (Opa5, Common) {
	"use strict";

	Opa5.extendConfig({
		arrangements : new Common(),
		actions: new Opa5({
			iLookAtTheScreen : function () {
				return this;
			}
		}),
		assertions: new Opa5({
			theUrlShouldNotContainParameter: function(sUrlParameter) {
				var oWindowWithinFrame = sap.ui.test.Opa5.getWindow();
				var bHasParamInUrl = oWindowWithinFrame.location.href.indexOf(sUrlParameter) < 0 ? true : false;
				return this.waitFor({
					success: function() {
						Opa5.assert.ok(bHasParamInUrl, sUrlParameter + " has been removed from window.location.href");
					},
					errorMessage: "Could not check window.location.href"
				});
			},
			theUrlShouldContainParameter: function(sUrlParameter) {
				var oWindowWithinFrame = sap.ui.test.Opa5.getWindow();
				var bHasParamInUrl = oWindowWithinFrame.location.href.indexOf(sUrlParameter) > 0 ? true : false;
				return this.waitFor({
					success: function() {
						Opa5.assert.ok(bHasParamInUrl, sUrlParameter + " exists in window.location.href");
					},
					errorMessage: "Could not check window.location.href"
				});
			}
		}),
		viewNamespace : "com.mii.scanner.view.",
		autoWait: true
	});
});

