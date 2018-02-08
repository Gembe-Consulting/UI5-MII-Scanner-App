sap.ui.require([
		'sap/ui/test/Opa5',
		'sap/ui/test/matchers/Interactable',
		"sap/ui/test/matchers/Properties",
		'sap/ui/test/matchers/PropertyStrictEquals',
		"sap/ui/test/matchers/Ancestor",
		'sap/ui/test/actions/Press',
		'sap/ui/test/actions/EnterText'
	],
	function(Opa5, Interactable, Properties, PropertyStrictEquals, Ancestor, Press, EnterText) {
		"use strict";
		var sViewName = "action.GoodsReceipt";

		Opa5.createPageObjects({

			onTheGoodsReceiptPage: {
				actions: {
					iCloseTheErrorMessage: function() {
						return this.waitFor({
							searchOpenDialogs: true,
							viewName: "sap.m.MessageBox",
							actions: new Press(),
							success: function() {
								Opa5.assert.ok(true, "Error message box has been closed");
							},
							errorMessage: "Did not find the Error Message Box"
						});
					}
				},
				assertions: {
					iShouldSeeTheSaveButtonIsDisabled: function() {
						return this.waitFor({
							id: "saveButton",
							visible: false,
							controlType: "sap.m.Button",
							viewName: sViewName,
							matchers: new PropertyStrictEquals({
								name: "enabled",
								value: false
							}),
							success: function(oButton) {
								Opa5.assert.ok(oButton.getVisible(), "The save button is visible");
								Opa5.assert.ok(!oButton.getEnabled(), "The save button is disabled");
							},
							errorMessage: "Did not find the enabled saveButton"
						});
					},
					iShouldSeeTheSaveButtonIsEnabled: function() {
						return this.waitFor({
							id: "saveButton",
							visible: false,
							controlType: "sap.m.Button",
							viewName: sViewName,
							matchers: new PropertyStrictEquals({
								name: "enabled",
								value: true
							}),
							success: function(oButton) {
								Opa5.assert.ok(oButton.getVisible(), "The save button is visible");
								Opa5.assert.ok(oButton.getEnabled(), "The save button is enabled");
							},
							errorMessage: "Did not find the enabled saveButton"
						});
					},
					iCanSeeTheErrorMessage: function() {
						var sErrorMessage = "Lagerort 'VG01' ist nicht für Buchungen vorgesehen.\nBitte korrigieren sie ihre Eingabe!";
						return this.waitFor({
							searchOpenDialogs: true,
							viewName: "sap.m.MessageBox",
							check: function() {
								return !!sap.ui.test.Opa5.getJQuery()(".sapMMessageBoxError").length && sap.ui.test.Opa5.getJQuery()(".sapMMessageBoxError").find(".sapMMsgBoxText").text() === sErrorMessage;
							},
							success: function(oMessageBox) {
								Opa5.assert.ok(true, "Error message box is shown");
							},
							errorMessage: "Did not find the Error Message Box"

						});
					},
					iShouldSeeAllInputFieldsAreInitial: function() {

						var oInitialControlData = {
							"storageUnitInput": "",
							"unitOfMeasureInput": "",
							"orderNumberInput": "",
							"storageLocationInput": "",
							"quantityInput": ""
						};

						jQuery.each(oInitialControlData, function(sControlId, sEmptyValue) {
							this.waitFor({
								id: sControlId,
								viewName: sViewName,
								success: function(oControl) {
									Opa5.assert.strictEqual(oControl.getValue(), sEmptyValue, sControlId + " is cleared and has value '" + sEmptyValue + "' now.");
								}
							});
						}.bind(this));

						return this;
					},
					iShouldSeeTheBusyIndicator: function() {
						
						return this.waitFor({
							viewName: "sap.m.MessageBox",
							check: function() {
								var sErrorMessage;
								return !!sap.ui.test.Opa5.getJQuery()(".sapMMessageBoxError").length && sap.ui.test.Opa5.getJQuery()(".sapMMessageBoxError").find(".sapMMsgBoxText").text() === sErrorMessage;
							},
							success: function(oMessageBox) {
								Opa5.assert.ok(true, "Error message box is shown");
							},
							errorMessage: "Did not find the Error Message Box"

						});
					}
				}
			}
		});
	});