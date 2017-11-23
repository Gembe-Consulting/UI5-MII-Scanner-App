sap.ui.require([
		"com/mii/scanner/test/integration/pages/Common",
		'sap/ui/test/Opa5',
		'sap/ui/test/matchers/Interactable',
		"sap/ui/test/matchers/Properties",
		'sap/ui/test/matchers/PropertyStrictEquals',
		'sap/ui/test/actions/Press',
		'sap/ui/test/actions/EnterText'
	],
	function(Common, Opa5, Interactable, Properties, PropertyStrictEquals, Press, EnterText) {
		"use strict";
		var sViewName = "GoodsReceipt";

		Opa5.createPageObjects({
			
			onTheGoodsReceiptPage:{
				baseClass: Common,
				actions:{
					
				},
				assertions: {

				}
			}
		});
	});