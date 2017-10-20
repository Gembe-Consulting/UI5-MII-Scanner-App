sap.ui.define([
		"sap/ui/model/json/JSONModel",
		"sap/ui/Device"
	], function (JSONModel, Device) {
		"use strict";

		return {

			createDeviceModel : function () {
				var oModel = new JSONModel(Device);
				oModel.setDefaultBindingMode("OneWay");
				return oModel;
			},
			
			prepareUserModel : function () {
				var oModel = this.getOwnercvomponent().getModel("user");
				oModel.setProperty("/d/results/0/Rowset/results/0/Row/results/0/", {});
				return oModel;
			}

		};

	}
);