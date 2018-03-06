sap.ui.define([
	"sap/ui/base/Object",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function(UI5Object, MessageBox, MessageToast) {
	"use strict";

	return UI5Object.extend("com.mii.scanner.controller.ErrorHandler", {

		/**
		 * Handles application errors by automatically attaching to the model events and displaying errors when needed.
		 * @class
		 * @param {sap.ui.core.UIComponent} oComponent reference to the app's component
		 * @public
		 * @alias com.mii.scanner.controller.ErrorHandler
		 */
		constructor: function(oComponent) {
			this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
			this._oComponent = oComponent;
			this._bMessageOpen = false;
			this._sErrorText = this._oResourceBundle.getText("errorText");

			// getting a namespace from manifest (component metadata) and access models
			var oManifestModels = oComponent.getMetadata().getManifestEntry("sap.ui5").models;

			var mapRequestEvents = function(sModelName) {

				var oModel = oComponent.getModel(sModelName);

				var showErrorMessage = function(oEvent) {
					var oParams = oEvent.getParameters();
					this._showServiceError(JSON.stringify(oParams), "Fehler: " + oEvent.sId + " in " + sModelName + "-Service");
				};

				var showMessageToast = function(oEvent) {
					var oParams = oEvent.getParameters();
					this._showServiceRequestToast(oEvent.sId + " to " + sModelName+ "\nreturning success=" + oEvent.getParameter("success"));
				};

				oModel.attachRequestFailed(showErrorMessage, this);

				oModel.attachParseError(showErrorMessage, this);

				if (this._oComponent.getDebugMode()) {
					oModel.attachRequestSent(showMessageToast, this);
					oModel.attachRequestCompleted(showMessageToast, this);
				}
			}.bind(this);

			Object.keys(oManifestModels).forEach(mapRequestEvents);
		},

		/**
		 * Shows a {@link sap.m.MessageBox} when a service call has failed.
		 * Only the first error message will be display.
		 * @param {string} sDetails a technical error to be displayed on request
		 * @private
		 */
		_showServiceError: function(sDetails, sTitle) {
			if (this._bMessageOpen) {
				return;
			}
			this._bMessageOpen = true;
			MessageBox.error(
				this._sErrorText, {
					id: "serviceErrorMessageBox",
					title: sTitle,
					details: sDetails,
					styleClass: this._oComponent.getContentDensityClass(),
					actions: [MessageBox.Action.CLOSE],
					onClose: function() {
						this._bMessageOpen = false;
					}.bind(this)
				}
			);
		},

		_showServiceRequestToast: function(sMessage) {
			sap.m.MessageToast.show(sMessage, {
				duration: 2000, // default 3000
				width: "15em", // default
				my: "center bottom", // default
				at: "center bottom", // default
				of: window, // default
				offset: "0 0", // default
				collision: "fit fit", // default
				onClose: null, // default
				autoClose: true, // default
				animationTimingFunction: "ease", // default
				animationDuration: 1000, // default
				closeOnBrowserNavigation: false // default true
			});
		}
	});
});