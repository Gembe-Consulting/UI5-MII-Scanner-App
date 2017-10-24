sap.ui.define([
	"com/mii/scanner/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("com.mii.scanner.controller.Login", {

		onInit: function() {},

		onLogin: function(oEvent) {
			var oInputControl = this.getView().byId("userIdInput"),
				sUserInput = oInputControl.getValue(),
				that = this;

			//prevent login, if user did not enter an username into login input
			if (!sUserInput && sUserInput.length <= 0) {
				return;
			}

			this.getOwnerComponent().testUserLoginName(sUserInput).then(function(oUser){
				jQuery.sap.log.info("Welcome " + oUser.USERVNAME +" "+ oUser.USERNNAME);
				// Remove error
				oInputControl.setValueState(sap.ui.core.ValueState.None);
				// Remove user input
				oInputControl.setValue("");
				// Navigate to homepage
				that.getRouter().navTo("home");
			}, function(err){
				jQuery.sap.log.warning(err);
				// set error state and error text
				oInputControl.setValueState(sap.ui.core.ValueState.Error)
					.setValueStateText("Benutzername '" + sUserInput + "' existiert nicht.");	
			});
		},

		onLogout: function(oEvent) {
			var bReplace = true;
			// delete user model
			this.getModel("user").setProperty("/", {});
			// navigate to login page
			this.getRouter().navTo("login", {}, bReplace);
		}

	});

});