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
					if (!this.getOwnerComponent().isUserLoggedIn()) {
						jQuery.sap.log.warning("User not logged in.", "Login status", this.toString());
						// redirect to login imidiatily
						this.getRouter().navTo("login", {}, true);
					} else {
						jQuery.sap.log.info("User logged in.", "Login status", this.toString());
					}
				}
			}, this);
			
		}
	});
});