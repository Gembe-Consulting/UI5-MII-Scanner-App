sap.ui.define([
	"./ActionBaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"com/mii/scanner/model/sapType"
], function(ActionBaseController, JSONModel, MessageBox, sapType) {
	"use strict";

	return ActionBaseController.extend("com.mii.scanner.controller.action.StartOperation", {

		sapType: sapType,

		_oInitData: {

		},

		onInit: function() {
			var oModel = new JSONModel(),
				oData = jQuery.extend({}, this._oInitData);
			oModel.setData(oData);
			this.setModel(oModel);
		}
	});

});