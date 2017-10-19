sap.ui.define([
	"com/mii/scanner/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("com.mii.scanner.controller.Login", {

		onInit: function() {

			var oModel = this.getOwnerComponent().getModel("user"),
				sUserNameByUrl = oModel.getProperty("/d/results/0/Rowset/results/0/Row/results/0/USERLOGIN");

			if (sUserNameByUrl) {
				this._doAutoLogin(sUserNameByUrl);
			}

		},

		_doAutoLogin: function(sUserNameByUrl) {
			if (!sUserNameByUrl) {
				return;
			}
			this.getView().byId("userIdInput").setValue(sUserNameByUrl);
			
			this.onLogin();
		},

		onLogin: function(oEvent) {
			var sUserInput = this.getView().byId("userIdInput").getValue(),
				sUpperUserInput;

			//prevent login, if user did not enter an username into login input
			if (!sUserInput && sUserInput.length <= 0) {
				return;
			}

			sUpperUserInput = sUserInput.toUpperCase();

			// check if provides username exists in MII
			if (this.testUserLoginName(sUpperUserInput)) {
				this.getRouter().navTo("home");
			} else {
				this.getView().byId("userIdInput").setValueState(sap.ui.core.ValueState.Error);
				this.getView().byId("userIdInput").setValueStateText("Benutzername '" + sUserInput +
					"' existiert nicht.");
			}
		},

		onLogout: function(oEvent) {
			var bReplace = true;
			// delete user model
			this.getModel("user").setProperty("/", {});
			// navigate to login page
			this.getRouter().navTo("login", {}, bReplace);
		},

		testUserLoginName: function(sUserInput) {
			var bUserLoggedIn,
				oUser;

			oUser = this._getUserLogin(sUserInput);

			return this._validateUserData(oUser, sUserInput);
		},

		/**
		 * @return an illuminator Row containig user data {__metadata: {…}, USERLOGIN: string, USERNNAME: string || null, USERVNAME: string || null, RowId: int}
		 * if no user has been found, 'undefined' is returned
		 */
		_getUserLogin: function(sUserInput) {
			var oModel = this.getOwnerComponent().getModel("user"),
				oParam = {
					"Param.1": sUserInput
				},
				bAsync = false;

			oModel.loadData(oModel._sUrl, oParam, bAsync);

			return oModel.getProperty("/d/results/0/Rowset/results/0/Row/results/0/");
		},

		/**
		 * Compares the USERLOGIN against user input
		 */
		_validateUserData: function(oUser, sUserInput) {
			return oUser.USERLOGIN === sUserInput;
		}

	});

});