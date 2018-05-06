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
		var sViewName = "action.tt.StartOperation";

		Opa5.createPageObjects({

			onTheStartOperationPage: {
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

					iShouldSeeAllInputFieldsAreInitial: function() {

						var oInitialControlData = {
							"orderNumberInput": "",
							"operationNumberInput": ""
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
								//user input data
								orderNumber: null,
								operationNumber: null,
								dateTimeValue: {},
								//external data
								AUFNR: null
							},
							oExpectedViewData = {
								bValid: false,
								bOrderOperationExists: false,
								orderInputValueState: sap.ui.core.ValueState.None,
								dateTimeInputValueState: sap.ui.core.ValueState.None,
								minDate: {},
								maxDate: {},
								userCommentEditIcon: "sap-icon://response",
								userCommentEditable: false
							};

						return this.waitFor({
							id: "startOperationPage",
							viewName: sViewName,
							success: function(oControl) {
								var oView = oControl.getParent(),
									oDataModel, oViewModel;

								Opa5.assert.strictEqual(oView.getViewName(), "com.mii.scanner.view.action.tt.StartOperation", "View " + oView.getViewName() + " found");

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