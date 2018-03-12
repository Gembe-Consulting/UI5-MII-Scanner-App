sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/Device"
], function(Controller, History, Device) {
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
			if (aParameters === undefined || aParameters === null) {
				return this.getResourceBundle().getText(sKey);
			} else {
				return this.getResourceBundle().getText(sKey, aParameters);
			}

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
		sendEvent: function(channel, event, data) {
			sap.ui.getCore().getEventBus().publish(channel, event, data);
		},

		/**
		 * Utility to subscribe to a channel and event
		 * @public
		 * @param {string} channel Event channel
		 * @param {string} event Event name
		 * @param {object} handler Event handler
		 * @param {object} listener Event listener
		 */
		subscribe: function(channel, event, handler, listener) {
			sap.ui.getCore().getEventBus().subscribe(channel, event, handler, listener);
		},

		/**
		 * Utility to unsubscribe to a channel and event
		 * @public
		 * @param {string} channel Event channel
		 * @param {string} event Event name
		 * @param {object} handler Event handler
		 * @param {object} listener Event listener
		 */
		unsubscribe: function(channel, event, handler, listener) {
			sap.ui.getCore().getEventBus().unsubscribe(channel, event, handler, listener);
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
			var sPreviousHash = History.getInstance().getPreviousHash();

			//The history contains a previous entry
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
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