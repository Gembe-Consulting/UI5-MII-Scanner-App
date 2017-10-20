sap.ui.define([
	"com/mii/scanner/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("com.mii.scanner.controller.Login", {

		onInit: function() {

			// var oModel = this.getOwnerComponent().getModel("user"),
			// 	sUserNameByUrl = oModel.getProperty("/USERLOGIN");

			// if (sUserNameByUrl) {
			// 	this._doAutoLogin(sUserNameByUrl);
			// }

		},

		_doAutoLogin: function(sUserNameByUrl) {
			if (!sUserNameByUrl) {
				return;
			}
			this.getView().byId("userIdInput").setValue(sUserNameByUrl);

			this.onLogin();
		},

		onLogin: function(oEvent) {
			var oInputControl = this.getView().byId("userIdInput"),
				sUserInput = oInputControl.getValue();

			//prevent login, if user did not enter an username into login input
			if (!sUserInput && sUserInput.length <= 0) {
				return;
			}

			// check if provides username exists in MII
			if (this.getOwnerComponent().testUserLoginName(sUserInput)) {
				oInputControl.setValueState(sap.ui.core.ValueState.None);
				this.getRouter().navTo("home");
			} else {
				oInputControl.setValueState(sap.ui.core.ValueState.Error)
					.setValueStateText("Benutzername '" + sUserInput + "' existiert nicht.");
			}
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