sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("test.playground.View1", {
		onCallExternalAppInNewFrame: function(oEvent) {
			var sStorageUnitNumber = this.byId("storageUnitNumber").getValue(),
				sOrderNumber = this.byId("orderNumber").getValue(),
				sUnit = this.byId("unitOfMeasure").getValue(),
				sStorageLocation = this.byId("storageLocation").getValue(),
				sNavigation = this.byId("navigation").getValue();

			var sPayload = "?";
			sPayload = sPayload + (sStorageUnitNumber ? "&LENUM=" + sStorageUnitNumber : "");
			sPayload = sPayload + (sOrderNumber ? "&AUFNR=" + sOrderNumber : "");
			sPayload = sPayload + (sUnit ? "&MEINH=" + sUnit : "");
			sPayload = sPayload + (sStorageLocation ? "&LGORT=" + sStorageLocation : "");

			window.open("https://webidetesting2178464-p1942861385trial.dispatcher.hanatrial.ondemand.com/webapp/test/mockServer.html?IllumLoginName=phigem&/#" + sNavigation + sPayload);
		},
		onCallExternalAppInSameWindow: function(oEvent) {
			var sStorageUnitNumber = this.byId("storageUnitNumber").getValue(),
				sOrderNumber = this.byId("orderNumber").getValue(),
				sUnit = this.byId("unitOfMeasure").getValue(),
				sStorageLocation = this.byId("storageLocation").getValue(),
				sNavigation = this.byId("navigation").getValue();

			var sPayload = "?";
			sPayload = sPayload + (sStorageUnitNumber ? "&LENUM=" + sStorageUnitNumber : "");
			sPayload = sPayload + (sOrderNumber ? "&AUFNR=" + sOrderNumber : "");
			sPayload = sPayload + (sUnit ? "&MEINH=" + sUnit : "");
			sPayload = sPayload + (sStorageLocation ? "&LGORT=" + sStorageLocation : "");

			window.open("https://webidetesting2178464-p1942861385trial.dispatcher.hanatrial.ondemand.com/webapp/test/mockServer.html?IllumLoginName=phigem&/#" + sNavigation + sPayload, "_self");
		},
		onCallExternalAppInPopup: function(oEvent) {
			var sStorageUnitNumber = this.byId("storageUnitNumber").getValue(),
				sOrderNumber = this.byId("orderNumber").getValue(),
				sUnit = this.byId("unitOfMeasure").getValue(),
				sStorageLocation = this.byId("storageLocation").getValue(),
				sNavigation = this.byId("navigation").getValue();

			var sPayload = "?";
			sPayload = sPayload + (sStorageUnitNumber ? "&LENUM=" + sStorageUnitNumber : "");
			sPayload = sPayload + (sOrderNumber ? "&AUFNR=" + sOrderNumber : "");
			sPayload = sPayload + (sUnit ? "&MEINH=" + sUnit : "");
			sPayload = sPayload + (sStorageLocation ? "&LGORT=" + sStorageLocation : "");

			window.open("https://webidetesting2178464-p1942861385trial.dispatcher.hanatrial.ondemand.com/webapp/test/mockServer.html?IllumLoginName=phigem&/#" + sNavigation + sPayload, "", "width = 300, height = 500");
		}
	});
});