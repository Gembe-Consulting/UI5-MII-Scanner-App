sap.ui.define([
	"./ActionBaseController",
	"sap/ui/model/json/JSONModel"
], function(ActionBaseController, JSONModel, MessageBox, MessageToast) {
	"use strict";

	var _oInitData = {
		LENUM: null,
		AUFNR: null,
		SOLLME: 0.0,
		MEINH: null,
		LGORT: '',
		INFO: null,
		bValid: false
	};

	return ActionBaseController.extend("com.mii.scanner.controller.action.GoodsIssue", {
		onInit: function() {
			var oModel = new JSONModel(),
				oData = jQuery.extend(_oInitData);

			oModel.setData(oData);
			this.setModel(oModel, "data");
			
			this.setModel(new JSONModel({type:null}), "view");

			this.getRouter().getRoute("goodsIssue").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(oEvent) {
			var oArgs, oView, oQuery;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();

			oQuery = oArgs["?query"];
			if (oQuery && oQuery.type) {
				oView.getModel("view").setProperty("/type", oQuery.type);
			} 
			if (oQuery && oQuery.LENUM) {
				oView.getModel("data").setProperty("/LENUM", oQuery.LENUM);
			} 
		}
	});

});