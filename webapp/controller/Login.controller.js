sap.ui.define([
	"com/mii/scanner/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("com.mii.scanner.controller.Login", {

		onLogin: function(oEvent) {
			var oInputControl = this.getView().byId("userIdInput"),
				sUserInput = oInputControl.getValue(),
				that = this;

			//prevent login, if user did not enter an username into login input
			if (!sUserInput && sUserInput.length <= 0) {
				return;
			}
			
			var fnResolveHandler = function(oUser) {
				jQuery.sap.log.info("Welcome " + oUser.USERVNAME + " " + oUser.USERNNAME);
				// Remove error
				oInputControl.setValueState(sap.ui.core.ValueState.None);
				// Remove user input
				oInputControl.setValue("");
				// Navigate to homepage
				that.getRouter().navTo("home");
			}.bind(this);

			var fnRejectHandler = function(oError) {
				jQuery.sap.log.warning("Benutzeranfrage abgelehnt: ", JSON.stringify(oError), this.toString());
				// set error state and error text
				oInputControl.setValueState(sap.ui.core.ValueState.Error)
					.setValueStateText("Benutzername '" + sUserInput + "' existiert nicht.");
			}.bind(this);

			/* The following logic relys on a Promise
			 * A promise is an object which can be returned synchronously from an asynchronous function.
			 * => this.getOwnerComponent().testUserLoginName() returns the promise
			 * Promises define a .then() method which you use to pass handlers which can take the resolved or rejected value.
			 * Because .then() always returns a new promise, it’s possible to chain promises with precise control 
			 * over how and where errors are handled. 
			 */
			this.getOwnerComponent().testUserLoginName(sUserInput)
				.then(fnResolveHandler, fnRejectHandler);

		}

	});

});