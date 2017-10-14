sap.ui.define([
		"com/mii/scanner/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("com.mii.scanner.controller.NotFound", {

			/**
			 * Navigates to the startpage when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("home");
			}

		});

	}
);