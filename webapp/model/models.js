sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function() {
			var oModel = new JSONModel(Device),
				oDefaults;
			oModel.setDefaultBindingMode("OneWay");

			oDefaults = {
				clearQuantityInputIcon: {
					mobile: {
						size: "1.75rem",
						width: "1.75rem",
						height: "2.75rem"
					},
					desktop: {
						size: "1.25rem",
						width: "1.25rem",
						height: "2.00rem"
					}
				}
			};

			oModel.setProperty("/defaults", oDefaults);

			return oModel;
		},

		prepareUserModel: function() {
			var oModel = new JSONModel();
			return oModel;
		}

	};

});