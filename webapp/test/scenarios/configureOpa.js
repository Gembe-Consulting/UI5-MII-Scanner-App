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
	"com/mii/scanner/test/pages/GoodsIssue",
	"com/mii/scanner/test/pages/StockTransfer",
	"com/mii/scanner/test/pages/RollerConveyor"
], function(Opa5, QUnitUtils, Common) {
	"use strict";

	Opa5.extendConfig({
			timeout: 7,
            pollingInterval: 100,
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

						Opa5.assert.ok(oControl.$()
							.hasClass("sapMFocus"), "Control " + sControlId + " has focus (has class 'sapMFocus')");
						Opa5.assert.ok(oControl.$()
							.hasClass("sapMInputFocused"), "Control " + sControlId + " has focus (has class 'sapMInputFocused')");
					},
					errorMessage: "Could not obtain control"
				});
			},
			iCanSeeControlHasCSSProperty: function(oOptions) {
				var that = this;
				return this.waitFor({
					viewName: oOptions.sViewName,
					id: oOptions.sControlId,
					success: function(oControl) {
						Opa5.assert.ok(!!oControl, "Control " + oOptions.sControlId + " has been found in " + oOptions.sViewName + " view");

						function hexToRgb(sHex) {
							var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(sHex);
							return result ? {
								r: parseInt(result[1], 16),
								g: parseInt(result[2], 16),
								b: parseInt(result[3], 16)
							} : null;
						};

						if (oOptions.sCssProperty === "color") {

							var oRGB = hexToRgb(oOptions.sValue);
							//"rgb(31, 53, 222)"
							oOptions.sValue = "rgb(" + oRGB.r + ", " + oRGB.g + ", " + oRGB.b + ")";
						}

						var sCSSValue = oControl.$().css(oOptions.sCssProperty);

						Opa5.assert.ok(sCSSValue === oOptions.sValue, "Control " + oOptions.sControlId + " has " + oOptions.sCssProperty + " " + oOptions.sValue);
					},
					errorMessage: "Could not obtain control"
				});
			}
		}),
		viewNamespace: "com.mii.scanner.view.",
		autoWait: true
	});
});