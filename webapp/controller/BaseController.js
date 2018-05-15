sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/Device",
	"./utilities"
], function(Controller, History, Device, Util) {
	"use strict";

	return Controller.extend("com.mii.scanner.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Get the translation for sKey
		 * @public
		 * @param {string} sKey the translation key
		 * @param {array} aParameters translation paramets (can be null)
		 * @returns {string} The translation of sKey
		 */
		getTranslation: function(sKey, aParameters) {
			if (typeof aParameters === "undefined" || aParameters === null) {
				return this.getResourceBundle().getText(sKey);
			}
			
			return this.getResourceBundle().getText(sKey, aParameters);
		},

		getResourceText: function(sResourceString) {
			return this.getTranslation(sResourceString);
		},

		/**
		 * Utility to send a bus event
		 * @public
		 * @param {string} channel Event channel
		 * @param {string} event Event name
		 * @param {object} data Event data
		 */
		sendEvent: function(sChannel, oEvent, oData) {
			sap.ui.getCore().getEventBus().publish(sChannel, oEvent, oData);
		},

		/**
		 * Utility to subscribe to a channel and event
		 * @public
		 * @param {string} channel Event channel
		 * @param {string} event Event name
		 * @param {object} handler Event handler
		 * @param {object} listener Event listener
		 */
		subscribe: function(sChannel, oEvent, oHandler, oListener) {
			sap.ui.getCore().getEventBus().subscribe(sChannel, oEvent, oHandler, oListener);
		},

		/**
		 * Utility to unsubscribe to a channel and event
		 * @public
		 * @param {string} channel Event channel
		 * @param {string} event Event name
		 * @param {object} handler Event handler
		 * @param {object} listener Event listener
		 */
		unsubscribe: function(sChannel, oEvent, oHandler, oListener) {
			sap.ui.getCore().getEventBus().unsubscribe(sChannel, oEvent, oHandler, oListener);
		},

		/**
		 * Get the Component
		 * @public
		 * @returns {object} The Component
		 */
		getComponent: function() {
			return this.getOwnerComponent();
		},

		onNavForward: function(oEvent) {
			var sNavTarget = oEvent.getSource().data("target"),
				sNavType = oEvent.getSource().data("type"),
				oType = {};

			if (sNavType) {
				oType = {
					query: {
						type: sNavType
					}
				};
			}

			this.getRouter().navTo(sNavTarget, oType);
		},

		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash(),
				iBack = -1;

			//The history contains a previous entry
			if (typeof sPreviousHash !== "undefined") {
				/* eslint-disable sap-no-history-manipulation */
				window.history.go(iBack);
				/* eslint-enable sap-no-history-manipulation */
			} else {
				// There is no history!
				// Naviate to home page
				this.getRouter().navTo("home", {}, !Device.system.phone);
			}
		},

		onNavHome: function() {
			this.getRouter().navTo("home");
		}
	});
});