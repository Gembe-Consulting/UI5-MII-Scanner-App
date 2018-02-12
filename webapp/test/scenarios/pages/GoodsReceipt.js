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
		var sViewName = "action.GoodsReceipt";

		Opa5.createPageObjects({
			onTheGoodsReceiptPage: {
				baseClass: Common,
				actions: {
					iCloseTheErrorMessage: function() {
						return this.iCloseTheMessageBox();
					},
				},
				assertions: {
					iShouldSeeTheSaveButtonIsDisabled: function() {
						var bEnabled = false;
						return this.iShouldSeeTheSaveButton(sViewName, bEnabled);
					},
					
					iShouldSeeTheSaveButtonIsEnabled : function() {
						var bEnabled = true;
						return this.iShouldSeeTheSaveButton(sViewName, bEnabled);
					},
					
					iCanSeeTheErrorMessage: function() {
						var sErrorMessage = "Lagerort 'VG01' ist nicht für Buchungen vorgesehen.\nBitte korrigieren sie ihre Eingabe!";
						return this.iShouldSeeTheErrorMessageBox(sErrorMessage);
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