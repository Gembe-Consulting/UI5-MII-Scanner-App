sap.ui.define([
	"./ActionBaseController",
	"sap/ui/model/json/JSONModel",
	"com/mii/scanner/model/sapType"
], function(ActionBaseController, JSONModel, sapType) {
	"use strict";

	return ActionBaseController.extend("com.mii.scanner.controller.action.GoodsIssue", {

		sapType: sapType,

		_aDisallowedStorageLocations: ["VG01"],

		_oInitData: {
			LENUM: null,
			AUFNR: null,
			MATNR: null,
			BULK: false,
			SOLLME: 0.0,
			MEINH: null,
			LGORT: '',
			INFO: null,
			bValid: false
		},
		onInit: function() {
			var oModel = new JSONModel(),
				oData = jQuery.extend(this._oInitData);

			oModel.setData(oData);
			this.setModel(oModel, "data");

			this.setModel(new JSONModel({
				type: null
			}), "view");

			this.getRouter().getRoute("goodsIssue").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(oEvent) {
			var oArgs, oView, oQuery;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();

			oQuery = oArgs["?query"];

			if (oQuery) {
				if (oQuery.type) {
					oView.getModel("view").setProperty("/type", oQuery.type);
				}
				if (oQuery.LENUM) {
					oView.getModel("data").setProperty("/LENUM", oQuery.LENUM);
				}
				if (oQuery.AUFNR) {
					oView.getModel("data").setProperty("/AUFNR", oQuery.AUFNR);
				}
				if (oQuery.MATNR) {
					oView.getModel("data").setProperty("/MATNR", oQuery.MATNR);
				}
			}
		}
	});

});