sap.ui.define([
	"com/mii/scanner/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("com.mii.scanner.controller.Login", {

		onInit: function() {},

		onLogin: function(oEvent) {
			var oInputControl = this.getView().byId("userIdInput"),
				sUserInput = oInputControl.getValue();

			//prevent login, if user did not enter an username into login input
			if (!sUserInput && sUserInput.length <= 0) {
				return;
			}

			this.getOwnerComponent().testUserLoginName(sUserInput).then(
				function(bLoginSuccess) {
					if (bLoginSuccess) {
						// Remove error
						oInputControl.setValueState(sap.ui.core.ValueState.None);
						// Remove user input
						oInputControl.setValue("");
						// Navigate to homepage
						this.getRouter().navTo("home");
					} else {
						oInputControl.setValueState(sap.ui.core.ValueState.Error)
							.setValueStateText("Benutzername '" + sUserInput + "' existiert nicht.");
					}
				}.bind(this),
				function(e) {
					alert(e);
				});

			// check if provides username exists in MII
			/*
			if (this.getOwnerComponent().testUserLoginName(sUserInput)) {
				// Remove error
				oInputControl.setValueState(sap.ui.core.ValueState.None);
				// Remove user input
				oInputControl.setValue("");
				// Navigate to homepage
				this.getRouter().navTo("home");
			} else {
				oInputControl.setValueState(sap.ui.core.ValueState.Error)
					.setValueStateText("Benutzername '" + sUserInput + "' existiert nicht.");
			}
			*/
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