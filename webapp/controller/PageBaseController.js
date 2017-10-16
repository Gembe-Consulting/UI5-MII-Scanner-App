sap.ui.define([
	"com/mii/scanner/controller/BaseController",
	"sap/m/MessageBox"
	], function(BaseController, MessageBox) {
	"use strict";

	return BaseController.extend("com.mii.scanner.controller.PageBaseController", {
		onInit: function() {
			var oThis = this;
			this.getView().addEventDelegate({
				"onBeforeShow": function(oEvent) {
					if (!this.getOwnerComponent()._isUserLoggedIn()) {
						jQuery.sap.log.warning("User not logged in.", "Login status", this.toString());
						// redirect to login imidiatily
						this.getRouter().navTo("login", {}, true);
					} else {
						jQuery.sap.log.info("User logged in.", "Login status", this.toString());
					}
				}
			}, oThis);
		}
	});
});