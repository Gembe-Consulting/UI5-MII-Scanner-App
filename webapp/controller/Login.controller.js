sap.ui.define([
	"com/mii/scanner/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("com.mii.scanner.controller.Login", {

		/**
		 * Löscht die aktuelle Zeichenkette im Einagebfeld nach einer bestimmten Zeitspanne.
		 */
		purgeInputAfterDelay: function(oInput, iUseDelay) {
			var iDelay = iUseDelay ? iUseDelay : 75, // default 75ms
				_tsStart = jQuery.sap.now(),
				_tsFinish = null;

			function purgeInput(oControl) {
				var sOldValue = oControl.getValue();
				if (sOldValue) {
					oControl.setValue("");
					_tsFinish = jQuery.sap.now();
					jQuery.sap.log.info("Input '" + sOldValue + "' has been purged after " + (_tsFinish - _tsStart) + " ms (target: " + iDelay + " ms", "Scanner-Input-Detection");
				}
			}

			//delayedCall(iDelay, oObject to be scoped on, method to be called after delay, aParameters to be passed to method?) : string	
			jQuery.sap.delayedCall(iDelay, this, purgeInput, [oInput]);

		},

		/**
		 * Triggers purging the input value on each input change.
		 * User has CONST_INPUT_BUFFER_DURATION ms time to complete his input.
		 * After that duration, input gets removed completely
		 */
		onLiveInput: function(oEvent) {
			var sCurrentInput = oEvent.getParameter("value"),
				oInput = oEvent.getSource(),
				bMobile = this.getModel("device").getProperty("/browser/mobile");

			// TODO: warum auch ungleich length 0?
			if (bMobile && sCurrentInput.length !== 0) {
				this.purgeInputAfterDelay(oInput, 250);
			}
		},

		onLogin: function(oEvent) {
			var oInputControl = this.getView().byId("usernameInput"),
				sUserInput = oInputControl.getValue(),
				oBundle = this.getResourceBundle(),
				fnResolveHandler,
				fnRejectHandler;

			//prevent login, if user did not enter an username into login input
			if (!sUserInput || sUserInput.length <= 0) {
				return;
			}

			sap.ui.core.BusyIndicator.show(0);

			// Reset value state
			oInputControl.setValueState(sap.ui.core.ValueState.None);

			/**
			 * Remove user input
			 * Navigate to homepage
			 */
			fnResolveHandler = function(oUser) {
				this.getRouter().navTo("home", {}, true /*bReplace*/ );
				oInputControl.setValue();
			}.bind(this);

			/**
			 * set error state and error text
			 */
			fnRejectHandler = function(oError) {
				oInputControl
					.setValueState(sap.ui.core.ValueState.Error)
					.setValueStateText(oBundle.getText("login.message.usernameIncorrect", [sUserInput]));
			}.bind(this);

			/* The following logic relys on a Promise
			 * A promise is an object which can be returned synchronously from an asynchronous function.
			 * => this.getOwnerComponent().testUserLoginName() returns the promise
			 * Promises define a .then() method which you use to pass handlers which can take the resolved or rejected value.
			 * Because .then() always returns a new promise, it’s possible to chain promises with precise control 
			 * over how and where errors are handled. 
			 */
			this.getOwnerComponent()
				.testUserLoginName(sUserInput)
				.then(fnResolveHandler, fnRejectHandler)
				.catch(jQuery.noop)
				.then(this.getOwnerComponent().hideBusyIndicator); //ensure to always remove busy

		}
	});
});