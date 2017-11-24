sap.ui.define([
	"./ActionBaseController",
	"sap/ui/model/json/JSONModel"
], function(ActionBaseController, JSONModel, MessageBox, MessageToast) {
	"use strict";

	var _aDisallowedStorageLocations = ["VG01"];

	return ActionBaseController.extend("com.mii.scanner.controller.action.GoodsReceipt", {
		onInit: function() {
			var oModel = new JSONModel(),
				oData = {
					LE: null,
					ORDER: null,
					MENGE: 0,
					ME: "",
					LGORT: "",
					INFO: ""
				};

			oModel.setData(oData);
			this.setModel(oModel);
		},

		onSave: function() {

		},

		//SUMISA/Production/trx_GoodsMovementToSap 
		getStorageBinInfo: function(sStorageBinNUmber) {

		},

		//SUMISA/Production/trx_GoodsMovementToSap 
		postGoodsReceipt: function() {

		},

		validateInputData: function() {

		},

		/**
		 * Check is a given storage location is allowed for posting
		 */
		isStorageLocationAllowed: function(sStorageLocation) {
			return _aDisallowedStorageLocations.indexOf(sStorageLocation) === -1;
		}
	});
});