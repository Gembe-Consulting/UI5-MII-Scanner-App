sap.ui.define([
	"com/mii/scanner/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.mii.scanner.controller.App", {
		onInit: function() {
			var oViewModel,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				originalBusyDelay: iOriginalBusyDelay
			});
			this.setModel(oViewModel, "appView");

			// apply content density mode to root view
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

			// Register the view with the message manager
			// for now, we do this in manifest file
			//sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);
			
			
		}
	});

});