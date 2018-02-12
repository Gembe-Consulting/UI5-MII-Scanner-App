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
					iShouldSeeDataModelAndViewModelAreInitial: function() {
						var oExpectedDataData = {
								LENUM: null,
								AUFNR: null,
								SOLLME: null,
								MEINH: null,
								LGORT: null,
								BESTQ: null
							},
							oExpectedViewData = {
								bStorageUnitValid: true,
								bOrderNumberValid: true,
								bValid: false,
								storageUnitNumberValueState: sap.ui.core.ValueState.None,
								orderNumberValueState: sap.ui.core.ValueState.None
							};

						this.waitFor({
							id: "goodsReceiptPage",
							viewName: sViewName,
							success: function(oControl) {
								var oView = oControl.getParent(),
									oDataModel, oViewModel;

								Opa5.assert.strictEqual(oView.getViewName(), "com.mii.scanner.view.action.GoodsReceipt", "View " + oView.getViewName() + " found");

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