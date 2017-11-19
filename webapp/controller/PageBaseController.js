sap.ui.define([
	"com/mii/scanner/controller/BaseController",
	"sap/m/MessageBox"
	], function(BaseController, MessageBox) {
	"use strict";

	return BaseController.extend("com.mii.scanner.controller.PageBaseController", {
		onInit: function() {
			
			this._bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			
			this.getView().addEventDelegate({
				"onBeforeShow": function(oEvent) {
					
					//First try to read user model
					//Next try fetching user from URL
					if (!this.getOwnerComponent().isUserLoggedIn()) {
						this.getOwnerComponent().testUserLoginName().then(
							function(oUser){
								jQuery.sap.log.info("User logged in.", "Login status", this.toString());
							}.bind(this), 
							function(oError){
								jQuery.sap.log.warning(oError.message, "Login status", this.toString());
								// redirect to login
								this.getRouter().navTo("login", {}, true);
							}.bind(this)
						);
					} else {
						jQuery.sap.log.info("User logged in.", "Login status", this.toString());
					}
					

				}
			}, this);
			
		}
	});
});