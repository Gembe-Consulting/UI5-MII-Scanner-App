sap.ui.define([
	"com/mii/scanner/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("com.mii.scanner.controller.Login", {

		onLogin: function(oEvent) {
			
			if(!this.getOwnerComponent()._isUserLoggedIn()){
				return;
			}
			
			if (this.performUserLogin()) {
				this.getRouter().navTo("home");
			}
		},

		onLogout: function(oEvent) {
			var bReplace = true;
			// delete user model
			this.getModel("user").setProperty("/", {});
			// navigate to login page
			this.getRouter().navTo("login", {}, bReplace);
		},

		performUserLogin: function() {
			var bUserLoggedIn =  this.getModel("user").getProperty("/IllumLoginName") && this.getModel("user").getProperty("/IllumLoginName") !== "";

			return bUserLoggedIn;
		}
		
	});

});