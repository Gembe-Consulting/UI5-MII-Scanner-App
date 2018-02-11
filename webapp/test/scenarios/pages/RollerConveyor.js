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
		var sViewName = "action.RollerConveyor";

		Opa5.createPageObjects({

			onTheRollerConveyorPage: {
				actions: {

				},
				assertions: {
					iShouldSeeAllInputFieldsAreInitial: function() {

						var oInitialControlData = {
							"storageUnitInput": "",
							"unitOfMeasureInput": "",
							"storageBinSelection": "",
							"stretcherActiveSwitch": false
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
								storageUnitNumber: null,
								entryQuantity: null,
								storageBinItem: null,
								storageBin: null,
								stretcherSwitch: false,
								// external data from storage unit
								LENUM: null,
								MEINH: null
							},
							oExpectedViewData = {
								bValid: false,
								bStorageUnitValid: true,
								storageUnitNumberValueState: sap.ui.core.ValueState.None,
								storageBinValueState: sap.ui.core.ValueState.None
							};

						this.waitFor({
							id: "rollerConveyorPage",
							viewName: sViewName,
							success: function(oControl) {
								var oView = oControl.getParent(),
									oDataModel, oViewModel;

								Opa5.assert.strictEqual(oView.getViewName(), "com.mii.scanner.view.action.RollerConveyor", "View " + oView.getViewName() + " found");

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