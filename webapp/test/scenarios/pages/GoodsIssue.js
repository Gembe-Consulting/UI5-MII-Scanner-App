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
		var sViewName = "action.GoodsIssue";

		Opa5.createPageObjects({

			onTheGoodsIssuePage: {
				baseClass: Common,
				actions: {
					iCloseTheErrorMessage: function() {
						return this.iCloseTheMessageBox();
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
											Opa5.assert.strictEqual(oControl.getState(), sEmptyValue, sControlId + " is cleared and has value '" + sEmptyValue + "' now.");
											break;
										case "sap.m.Input":
											Opa5.assert.strictEqual(oControl.getValue(), sEmptyValue, sControlId + " is cleared and has value '" + sEmptyValue + "' now.");
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
											Opa5.assert.strictEqual(oControl.getState(), sEmptyValue, sControlId + " is cleared and has value '" + sEmptyValue + "' now.");
											break;
										case "sap.m.Input":
											Opa5.assert.strictEqual(oControl.getValue(), sEmptyValue, sControlId + " is cleared and has value '" + sEmptyValue + "' now.");
											break;
										default:
											Opa5.assert.ok(false, sControlId + " is not valid for initial check.");
									}
								}
							});
						}.bind(this));

						return this;
					},

					iShouldSeeDataModelAndViewModelWithLeAreInitial: function() {
						var oExpectedViewData = {
							type: "withLE",
							bStorageUnitValid: true,
							bOrderNumberValid: true,
							bValid: false,
							storageUnitNumberValueState: sap.ui.core.ValueState.None,
							orderNumberValueState: sap.ui.core.ValueState.None,
							materialNumberValueState: sap.ui.core.ValueState.None
						};
						return this.iShouldSeeDataModelAndViewModelAreInitial(oExpectedViewData);
					},

					iShouldSeeDataModelAndViewModelNonLeAreInitial: function() {
						var oExpectedViewData = {
							type: "nonLE",
							bStorageUnitValid: true,
							bOrderNumberValid: true,
							bValid: false,
							storageUnitNumberValueState: sap.ui.core.ValueState.None,
							orderNumberValueState: sap.ui.core.ValueState.None,
							materialNumberValueState: sap.ui.core.ValueState.None
						};
						return this.iShouldSeeDataModelAndViewModelAreInitial(oExpectedViewData);
					},

					iShouldSeeDataModelAndViewModelAreInitial: function(oExpectedViewData) {
						var oExpectedDataData = {
							//entry screen data
							entryQuantity: null,
							unitOfMeasure: null,
							orderNumber: null,
							storageUnitNumber: null,
							storageLocation: null,
							materialNumber: null,
							bulkMaterialIndicator: false,
							//storage unit data
							LENUM: null,
							MEINH: null,
							BESTQ: null,
							VFDAT: null
						};

						return this.waitFor({
							id: "goodsIssuePage",
							viewName: sViewName,
							success: function(oControl) {
								var oView = oControl.getParent(),
									oDataModel, oViewModel;

								Opa5.assert.strictEqual(oView.getViewName(), "com.mii.scanner.view.action.GoodsIssue", "View " + oView.getViewName() + " found");

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