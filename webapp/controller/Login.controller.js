sap.ui.define([
	"com/mii/scanner/controller/BaseController"
], function(BaseController) {
	"use strict";

	var CONST_INPUT_BUFFER_DURATION = 75;
	var CONST_EMPTY_STRING = "";

	return BaseController.extend("com.mii.scanner.controller.Login", {

		/**
		 * 	Dient zur Erkennung von Scanner-Eingaben und Unterscheidung ggü. manuelle Eingaben.
		 *	Gibt das eingegebene Zeichen zurück oder - am Ende des Scanvorgangs - den gescannten Wert.
		 **/

		checkInputType: function(sInput) {

			// If as been initialied, remove data form input field
			if (this._sInputString === CONST_EMPTY_STRING) {
				jQuery.sap.log.debug("this._sInputString is empty => manual user input detected!", "Scanner-Input-Detection");
				this._sInputString = null; //invalidate
				return;
			} else {
				this._sInputString = sInput;
			}

			setTimeout(function() {
				this._sInputString = CONST_EMPTY_STRING;
				jQuery.sap.log.debug("this._sInputString cleared after " + CONST_INPUT_BUFFER_DURATION + " ms", "Scanner-Input-Detection");
			}.bind(this), CONST_INPUT_BUFFER_DURATION);

			return sInput;
		},

		onLiveInput: function(oEvent) {
			var sCurrentInput = oEvent.getParameter("value"),
				oInput = oEvent.getSource(),
				sDetectedInput;

			sDetectedInput = this.checkInputType(sCurrentInput);

			if (sDetectedInput !== sCurrentInput) {
				oInput.setValue(CONST_EMPTY_STRING);
				jQuery.sap.log.debug("Cleard Input field.", "Scanner-Input-Detection");
			}

		},

		preventKeyboardInput: function(oEvent) {
			var sCurrentInput = oEvent.getParameter("value"),
				oInput = oEvent.getSource();
			setTimeout(function() {
				oInput.setValue(CONST_EMPTY_STRING);
				jQuery.sap.log.debug("Input " + sCurrentInput + " cleared after " + CONST_INPUT_BUFFER_DURATION + " ms -> no manual input allowed!", "Scanner-Input-Detection");
			}.bind(this), CONST_INPUT_BUFFER_DURATION);
		},

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