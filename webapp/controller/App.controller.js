sap.ui.define([
	"com/mii/scanner/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.mii.scanner.controller.App", {

		onInit: function() {
			var oViewModel,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				originalBusyDelay: iOriginalBusyDelay
			});
			this.setModel(oViewModel, "appView");

			// apply content density mode to root view
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},

		onLogin: function(oEvent) {
			if (this.performUserLogin()) {
				this.getRouter().navTo("home");
			}
		},

		onLogout: function(oEvent) {
			var bReplace = true;
			this.getRouter().navTo("login", {}, bReplace);
		},

		performUserLogin: function() {
			var bUserLoggedIn =  this.getModel("user").getProperty("/IllumLoginName") && this.getModel("user").getProperty("/IllumLoginName") !== "";

			return bUserLoggedIn;
		},
	});

});