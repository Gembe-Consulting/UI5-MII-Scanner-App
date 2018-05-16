sap.ui.define([
	"com/mii/scanner/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("com.mii.scanner.controller.PageBaseController", {
		onInit: function() {

			this._bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;

			this.getView().addEventDelegate({
				onBeforeShow: function(oEvent) {

					var oComponent = this.getOwnerComponent(),
						onResolvedUser, onRejectedUser;

					onRejectedUser = jQuery.proxy(oComponent.forceRedirectToLoginPage, oComponent);
					onResolvedUser = jQuery.proxy(oComponent.testUserLoginName, oComponent);

					// First try to read user model. If no user model is present
					// Try to discover/fetch IllumLoginName vom html body
					// Test discovered IllumLoginName against MII backend
					// If this username is invalid, we will redirect to login page
					if (!oComponent.isUserLoggedIn()) {
						oComponent.discoverIllumLoginName().then(onResolvedUser, onRejectedUser);
					}
				}
			}, this);
		}
	});
});