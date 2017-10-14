sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/routing/History",
		"sap/ui/Device"
	], function (Controller, History, Device) {
		"use strict";

		return Controller.extend("com.mii.scanner.controller.BaseController", {
			/**
			 * Convenience method for accessing the router.
			 * @public
			 * @returns {sap.ui.core.routing.Router} the router for this component
			 */
			getRouter : function () {
				return sap.ui.core.UIComponent.getRouterFor(this);
			},

			/**
			 * Convenience method for getting the view model by name.
			 * @public
			 * @param {string} [sName] the model name
			 * @returns {sap.ui.model.Model} the model instance
			 */
			getModel : function (sName) {
				return this.getView().getModel(sName);
			},

			/**
			 * Convenience method for setting the view model.
			 * @public
			 * @param {sap.ui.model.Model} oModel the model instance
			 * @param {string} sName the model name
			 * @returns {sap.ui.mvc.View} the view instance
			 */
			setModel : function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
			},

			/**
			 * Getter for the resource bundle.
			 * @public
			 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
			 */
			getResourceBundle : function () {
				return this.getOwnerComponent().getModel("i18n").getResourceBundle();
			},
			
			getResourceText : function(sResourceString){
				return this.getResourceBundle().getText(sResourceString);
			},
			
			onAfterRendering:function(){
			},
			
			onNavForwardEvent:function(oEvent){
				var sTarget = oEvent.getSource().data("target");
				this.getRouter().navTo(sTarget);
			},
			
			
			onNavBack : function() {
				var sPreviousHash = History.getInstance().getPreviousHash();
				
				//The history contains a previous entry
				if (sPreviousHash !== undefined) {
					history.go(-1);
				} else {
					// There is no history!
					// Naviate to master page
					this.getRouter().navTo("home", {}, !Device.system.phone);
				}
			}

		});

	}
);