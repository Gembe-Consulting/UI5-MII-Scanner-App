sap.ui.define([
	"./ActionBaseController",
	"sap/ui/model/json/JSONModel"
], function(ActionBaseController, JSONModel, MessageBox, MessageToast) {
	"use strict";

	return ActionBaseController.extend("com.mii.scanner.controller.action.StockTransfer", {
		onInit:function(){
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
		}
	});

});