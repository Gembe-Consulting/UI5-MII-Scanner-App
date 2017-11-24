sap.ui.define([
	"./ActionBaseController",
	"sap/ui/model/json/JSONModel"
], function(ActionBaseController, JSONModel, MessageBox, MessageToast) {
	"use strict";

	return ActionBaseController.extend("com.mii.scanner.controller.action.GoodsIssue", {
		onInit:function(){
			var oModel = new JSONModel(),
				oData = {
				};
				
			oModel.setData(oData);
			this.setModel(oModel);
		}
	});

});