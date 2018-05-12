sap.ui.require([
		"sap/ui/test/Opa5",
		"sap/ui/test/matchers/Interactable",
		"sap/ui/test/matchers/Properties",
		"sap/ui/test/matchers/PropertyStrictEquals",
		"sap/ui/test/matchers/Ancestor",
		"sap/ui/test/actions/Press",
		"sap/ui/test/actions/EnterText",
		"com/mii/scanner/test/arrangement/Common"
	],
	function(Opa5, Interactable, Properties, PropertyStrictEquals, Ancestor, Press, EnterText, Common) {
		"use strict";
		var sViewName = "action.gm.RollerConveyor";

		Opa5.createPageObjects({

			onTheRollerConveyorPage: {
				baseClass: Common,
				actions: {
					iConfirmTheMessageBox: function() {
						return this.iCloseTheMessageBox("Ja");
					}
				},
				assertions: {

					iShouldSeeTheSaveButtonIsDisabled: function() {
						var bEnabled = false;
						return this.iShouldSeeTheSaveButton(sViewName, bEnabled);
					},

					iShouldSeeTheSaveButtonIsEnabled: function() {
						var bEnabled = true;
						return this.iShouldSeeTheSaveButton(sViewName, bEnabled);
					},

					iShouldSeeStoragebinselectionContains2EnabledItems: function() {
						var iNumberOfItems = 2,
							sControlId = "storageBinSelection";

						return this.waitFor({
							id: sControlId,
							viewName: sViewName,
							success: function(oControl) {
								//var activeItems = oControl.getItems().filter(item => item.getEnabled());
								var activeItems = oControl.getItems().filter(function(item) {
									return item.getEnabled();
								});

								Opa5.assert.strictEqual(activeItems.length, iNumberOfItems, sControlId + " has " + iNumberOfItems + " active items");
								Opa5.assert.strictEqual(activeItems[0].getKey(), "ROLLENBAHN", "First active item is ROLLENBAHN");
								Opa5.assert.strictEqual(activeItems[1].getKey(), "STAPLER", "Second active item is STAPLER");
							}
						});
					},
					iShouldSeeStoragebinselectionContainsOther2EnabledItems: function() {
						var iNumberOfItems = 2,
							sControlId = "storageBinSelection";

						return this.waitFor({
							id: sControlId,
							viewName: sViewName,
							success: function(oControl) {
								var activeItems = oControl.getItems().filter(function(item) {
									return item.getEnabled();
								});

								Opa5.assert.strictEqual(activeItems.length, iNumberOfItems, sControlId + " has " + iNumberOfItems + " active items");
								Opa5.assert.strictEqual(activeItems[0].getKey(), "BEUM", "First active item is BEUM");
								Opa5.assert.strictEqual(activeItems[1].getKey(), "PALE", "Second active item is PALE");
							}
						});
					},
					iShouldSeeAllInputFieldsAreInitial: function() {

						var oInitialControlData = {
							"storageUnitInput": "",
							"unitOfMeasureInput": "",
							"quantityInput": "",
							"storageBinSelection": "",
							"stretcherActiveSwitch": true
						};

						jQuery.each(oInitialControlData, function(sControlId, sEmptyValue) {
							this.waitFor({
								id: sControlId,
								viewName: sViewName,
								success: function(oControl) {
									var sControlClassName = oControl.getMetadata().getName();
									switch (sControlClassName) {
										case "sap.m.Switch":
											Opa5.assert.strictEqual(oControl.getState(), sEmptyValue, sControlClassName + " " + sControlId + " is cleared and has value '" + sEmptyValue + "' now.");
											break;
										case "sap.m.Input":
											Opa5.assert.strictEqual(oControl.getValue(), sEmptyValue, sControlClassName + " " + sControlId + " is cleared and has value '" + sEmptyValue + "' now.");
											break;
										case "sap.m.ComboBox":
											Opa5.assert.strictEqual(oControl.getValue(), sEmptyValue, sControlClassName + " " + sControlId + " is cleared and has value '" + sEmptyValue + "' now.");
											break;
										default:
											Opa5.assert.ok(false, sControlId + " is not valid for initial check.");
									}
								}
							});
						}.bind(this));

						return this;
					},
					iShouldSeeDataModelAndViewModelAreInitial: function() {
						var oExpectedDataData = {
								// entry data
								storageUnit: null,
								entryQuantity: null,
								unitOfMeasure: null,
								storageBin: null,
								stretcherActive: true,
								// external data from storage unit
								LENUM: null,
								MEINH: null,
								ISTME: null
							},
							oExpectedViewData = {
								bValid: false,
								bStorageUnitValid: true,
								storageUnitValueState: sap.ui.core.ValueState.None,
								storageBinValueState: sap.ui.core.ValueState.None
							};

						return this.waitFor({
							id: "rollerConveyorPage",
							viewName: sViewName,
							success: function(oControl) {
								var oView = oControl.getParent(),
									oDataModel, oViewModel;

								Opa5.assert.strictEqual(oView.getViewName(), "com.mii.scanner.view.action.gm.RollerConveyor", "View " + oView.getViewName() + " found");

								oDataModel = oView.getModel("data");
								oViewModel = oView.getModel("view");

								Opa5.assert.propEqual(oDataModel.getData(), oExpectedDataData, "Data model is inital");

								Opa5.assert.propEqual(oViewModel.getData(), oExpectedViewData, "View model is inital");
							},
							errorMessage: "Could not find control"
						});

					}
				}
			}
		});
	});