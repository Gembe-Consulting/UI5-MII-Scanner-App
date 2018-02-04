sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/qunit/QUnitUtils",
	"com/mii/scanner/test/arrangement/Common",
	// QUnit additions
	"sap/ui/qunit/qunit-css",
	"sap/ui/qunit/qunit-junit",
	"sap/ui/qunit/qunit-coverage",
	// Page Objects
	"com/mii/scanner/test/pages/Login",
	"com/mii/scanner/test/pages/GoodsReceipt",
	"com/mii/scanner/test/pages/GoodsIssue"
], function(Opa5, QUnitUtils, Common) {
	"use strict";

	Opa5.extendConfig({

		arrangements: new Common(),
		actions: new Opa5({
			iLookAtTheScreen: function() {
				return this;
			}
		}),
		assertions: new Opa5({

			iCanSeeControlHasFocus: function(sControlId, sViewName) {
				var that = this;
				return this.waitFor({
					viewName: sViewName,
					id: sControlId,
					success: function(oControl) {
						Opa5.assert.ok(true, "Control " + sControlId + " has been found in " + sViewName + " view");

						Opa5.assert.ok(oControl.$().hasClass("sapMFocus"), "Control " + sControlId + " has focus (has class 'sapMFocus')");
						Opa5.assert.ok(oControl.$().hasClass("sapMInputFocused"), "Control " + sControlId + " has focus (has class 'sapMInputFocused')");
					},
					errorMessage: "Could not obtain control"
				});
			},

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
		viewNamespace: "com.mii.scanner.view.",
		autoWait: true
	});
});