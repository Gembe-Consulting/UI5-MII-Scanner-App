sap.ui.require([
	"com/mii/scanner/test/integration/pages/Common",
	"sap/ui/test/Opa5",
	"sap/ui/test/matchers/Interactable",
	"sap/ui/test/matchers/Properties",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText"
], function(Common, Opa5, Interactable, Properties, PropertyStrictEquals, Press, EnterText) {
	"use strict";

	Opa5.createPageObjects({

		onGoodsReceiptPage: {
			baseClass: Common,
			actions: {
				iPressTheBackButton: function() {
					return this.waitFor({
						id: "goodsReceiptPage",
						viewName: "GoodsReceipt",
						viewNamespace: "com.mii.scanner.view.action.",
						actions: new Press(),
						errorMessage: "Did not find the back nav button on page"
					});
				}
			},
			assertions: {
				theAppShouldNavigateToGoodsReceiptPage: function(sExpectedValue) {
					return this.waitFor({
						id: "goodsReceiptPage",
						viewName: "GoodsReceipt",
						viewNamespace: "com.mii.scanner.view.action.",
						success: function(oGRPage) {
							Opa5.assert.ok(true, "Goods Receipt Action Page loaded.");
						},
						errorMessage: "Failed to load Goods Receipt Action Page."
					});
				}
			}
		},
		onStartOperationPage: {
			baseClass: Common,
			actions: {
				iPressTheBackButton: function() {
					return this.waitFor({
						id: "startOperationPage",
						viewName: "StartOperation",
						viewNamespace: "com.mii.scanner.view.action.",
						actions: new Press(),
						errorMessage: "Did not find the back nav button on page"
					});
				}
			},
			assertions: {
				theAppShouldNavigateToStartOperationPage: function(sExpectedValue) {
					return this.waitFor({
						id: "startOperationPage",
						viewName: "StartOperation",
						viewNamespace: "com.mii.scanner.view.action.",
						success: function(oSOPage) {
							Opa5.assert.ok(true, "Start Operation Action Page loaded.");
						},
						errorMessage: "Failed to load Start Operation Action Page."
					});
				}
			}
		}
	});
});