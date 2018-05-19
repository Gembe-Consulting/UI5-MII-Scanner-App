sap.ui.define([
	"com/mii/scanner/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("com.mii.scanner.controller.PageBaseController", {
		onInit: function() {

			this._bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;

			this.getView().addEventDelegate({
				onBeforeShow: function(oEvent) {
					var oUserHandler = this.getOwnerComponent().getUserHandler(),
						onResolvedUser, onRejectedUser;

					onResolvedUser = jQuery.proxy(oUserHandler.testUserLoginName, oUserHandler);
					onRejectedUser = jQuery.proxy(oUserHandler.forceRedirectToLoginPage, oUserHandler);

					// First try to read user model. If no user model is present
					// Try to discover/fetch IllumLoginName vom html body
					// Test discovered IllumLoginName against MII backend
					// If this username is invalid, we will redirect to login page
					if (!oUserHandler.isUserLoggedIn()) {
						oUserHandler.discoverIllumLoginName().then(onResolvedUser, onRejectedUser);
					}
				}
			}, this);
		}
	});
});