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
		}
	});

});