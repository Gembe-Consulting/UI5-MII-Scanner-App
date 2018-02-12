sap.ui.require([
		"sap/ui/test/Opa5",
		"sap/ui/test/matchers/Interactable",
		"sap/ui/test/matchers/Properties",
		"sap/ui/test/matchers/PropertyStrictEquals",
		"sap/ui/test/matchers/Ancestor",
		"sap/ui/test/actions/Press",
		"sap/ui/test/actions/EnterText"
	],
	function(Opa5, Interactable, Properties, PropertyStrictEquals, Ancestor, Press, EnterText) {
		"use strict";
		var sViewName = "action.GoodsIssue";

		Opa5.createPageObjects({

			onTheGoodsIssuePage: {
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
					iShouldSeeAllNonLeInputFieldsAreInitial: function() {

						var oInitialControlData = {
							"orderNumberInput": "",
							"storageLocationInput": "",
							"materialNumberInput": "",
							"quantityInput": "",
							"unitOfMeasureInput": "",
							"bulkMaterialSwitch": false
						};

						jQuery.each(oInitialControlData, function(sControlId, sEmptyValue) {
							this.waitFor({
								id: sControlId,
								viewName: sViewName,
								success: function(oControl) {
									switch (oControl.getMetadata().getName()) {
										case "sap.m.Switch":
											Opa5.assert.strictEqual(oControl.getState(), sEmptyValue, sControlId + " is cleared and has value "" + sEmptyValue + "" now.");
											break;
										case "sap.m.Input":
											Opa5.assert.strictEqual(oControl.getValue(), sEmptyValue, sControlId + " is cleared and has value "" + sEmptyValue + "" now.");
											break;
										default:
											Opa5.assert.ok(false, sControlId + " is not valid for initial check.");
									}
								}
							});
						}.bind(this));

						return this;
					},
					iShouldSeeAllWithLeInputFieldsAreInitial: function() {

						var oInitialControlData = {
							"storageUnitInput": "",
							"orderNumberInput": "",
							"quantityInput": "",
							"unitOfMeasureInput": ""
						};

						jQuery.each(oInitialControlData, function(sControlId, sEmptyValue) {
							this.waitFor({
								id: sControlId,
								viewName: sViewName,
								success: function(oControl) {
									switch (oControl.getMetadata().getName()) {
										case "sap.m.Switch":
											Opa5.assert.strictEqual(oControl.getState(), sEmptyValue, sControlId + " is cleared and has value "" + sEmptyValue + "" now.");
											break;
										case "sap.m.Input":
											Opa5.assert.strictEqual(oControl.getValue(), sEmptyValue, sControlId + " is cleared and has value "" + sEmptyValue + "" now.");
											break;
										default:
											Opa5.assert.ok(false, sControlId + " is not valid for initial check.");
									}	
								}
							});
						}.bind(this));

						return this;
					}
				}
			}
		});
	});