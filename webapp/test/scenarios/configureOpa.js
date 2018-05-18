sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/qunit/QUnitUtils",
	"com/mii/scanner/test/arrangement/Common",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/PropertyStrictEquals",
	// QUnit additions
	"sap/ui/qunit/qunit-css",
	"sap/ui/qunit/qunit-junit",
	"sap/ui/qunit/qunit-coverage",
	// Page Objects
	"com/mii/scanner/test/pages/Login",
	"com/mii/scanner/test/pages/GoodsReceipt",
	"com/mii/scanner/test/pages/GoodsIssue",
	"com/mii/scanner/test/pages/StockTransfer",
	"com/mii/scanner/test/pages/RollerConveyor",
	"com/mii/scanner/test/pages/StartOperation",
	"com/mii/scanner/test/pages/FinishOperation",
	"com/mii/scanner/test/pages/InterruptOperation",
	"com/mii/scanner/test/pages/ResumeOperation"
], function(Opa5, QUnitUtils, Common, EnterText, PropertyStrictEquals) {
	"use strict";

	Opa5.extendConfig({
		timeout: 20,
		pollingInterval: 100,
		arrangements: new Common(),
		actions: new Opa5({
			iLookAtTheScreen: function() {
				return this;
			},
			iCanEnterRelativeDate: function(oOptions) {

				Opa5.assert.strictEqual(!sap.ui.test.Opa.getContext().oDate, true, "Verified that oDate moment is initial before 'iCanEnterRelativeDate()'");
				var oBaseDate = moment();
				sap.ui.test.Opa.getContext().oDate = oBaseDate; // define for later use
				
				this.lastDate = oBaseDate.clone();

				if (oOptions.direction === "future") {
					sap.ui.test.Opa.getContext().oDate.add(oOptions.offset, oOptions.unit).add(oOptions.timeOffset, oOptions.timeUnit);
				} else if (oOptions.direction === "past") {
					sap.ui.test.Opa.getContext().oDate.subtract(oOptions.offset, oOptions.unit).subtract(oOptions.timeOffset, oOptions.timeUnit);
				} else {
					Opa5.assert.ok(false, "'" + oOptions.direction + "' direction not valid");
				}

				return this.waitFor({
					viewName: oOptions.viewName,
					id: oOptions.controlId,
					actions: new EnterText({
						text: sap.ui.test.Opa.getContext().oDate.format("DD.MM.YYYY, HH:mm:ss")
					}),
					success: function(oControl) {
						Opa5.assert.strictEqual(sap.ui.test.Opa.getContext().oDate.isValid(), true, "Verified that oDate moment is valid");
						Opa5.assert.ok(true, "Enter value " + sap.ui.test.Opa.getContext().oDate.format("DD.MM.YYYY, HH:mm:ss") + " into " + oControl.getId());
						
						if(oOptions.direction === "future"){
							sap.ui.test.Opa.getContext().oDate = this.lastDate;
						}
						
					},
					errorMessage: "Could not obtain control"
				});
			}
		}),
		assertions: new Opa5({
			iSouldSeeRelativeDate: function(oOptions) {

				Opa5.assert.strictEqual(!sap.ui.test.Opa.getContext().oDate, false, "Verified that oDate moment has been set by 'iCanEnterRelativeDate()'");

				return this.waitFor({
					viewName: oOptions.viewName,
					id: oOptions.controlId,
					matchers: new PropertyStrictEquals({
						name: "value",
						value: sap.ui.test.Opa.getContext().oDate.format("DD.MM.YY, HH:mm")
					}),
					success: function(oControl) {
						Opa5.assert.strictEqual(sap.ui.test.Opa.getContext().oDate.isValid(), true, "Verified that oDate moment is valid");
						Opa5.assert.strictEqual(sap.ui.test.Opa.getContext().oDate.toDate().toString(), oControl.getDateValue().toString(), "Verified that the js Date object has equal timestamp: " + sap.ui.test.Opa.getContext().oDate.toDate().toString());

						Opa5.assert.ok(true, oControl.getId() + " has value " + sap.ui.test.Opa.getContext().oDate.format("DD.MM.YY, HH:mm"));

						sap.ui.test.Opa.getContext().oDate = undefined;

						Opa5.assert.strictEqual(!sap.ui.test.Opa.getContext().oDate, true, "Verified that oDate moment is initial after 'iCanEnterRelativeDate()'");
					},
					errorMessage: "Could not obtain control"
				});
			},
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