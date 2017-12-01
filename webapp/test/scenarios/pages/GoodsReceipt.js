sap.ui.require([
		'sap/ui/test/Opa5',
		'sap/ui/test/matchers/Interactable',
		"sap/ui/test/matchers/Properties",
		'sap/ui/test/matchers/PropertyStrictEquals',
		'sap/ui/test/actions/Press',
		'sap/ui/test/actions/EnterText'
	],
	function(Opa5, Interactable, Properties, PropertyStrictEquals, Press, EnterText) {
		"use strict";
		var sViewName = "action.GoodsReceipt";

		Opa5.createPageObjects({

			onTheGoodsReceiptPage: {
				actions: {
					iRestoreAllInput: function() {

					}
				},
				assertions: {
					iCanSeeTheErrorMessage: function() {
						var sErrorMessage = "Lagerort VG01 ist nicht für Buchungen vorgesenen.\nBitte korrigieren!";
						this.waitFor({
							//searchOpenDialogs: true,
							//controlType: "sap.m.MessageBox",
							viewName: "sap.m.MessageBox",
							// check: function() {debugger;
							// 	return !!sap.ui.test.Opa5.getJQuery()(".sapMMessageBoxError").length && sap.ui.test.Opa5.getJQuery()(".sapMMessageBoxError").find(".sapMMsgBoxText ").text() === sErrorMessage;
							// },
							success: function(oMessageBox){
								debugger;
							},
							errorMessage: "Did not find the Error Message Box"

						});
						return this;

					}
				}
			}
		});
	});