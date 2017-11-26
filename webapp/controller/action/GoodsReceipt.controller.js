sap.ui.define([
	"./ActionBaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(ActionBaseController, JSONModel, MessageBox) {
	"use strict";

	var _aDisallowedStorageLocations = ["VG01"];

	var _oInitData = {
		LENUM: null,
		AUFNR: null,
		SOLLME: 0.0,
		MEINH: null,
		LGORT: '',
		INFO: null,
		bValid: false
	};

	return ActionBaseController.extend("com.mii.scanner.controller.action.GoodsReceipt", {
		onInit: function() {

			var oModel = new JSONModel(),
				oData = jQuery.extend(_oInitData);

			oModel.setData(oData);
			this.setModel(oModel, "data");
		},

		updateViewControls: function() {
			var oModel = this.getModel("data"),
				bReadyForPosting;
			bReadyForPosting = this.isInputDataValid(oModel.getData());

			oModel.setProperty("/bValid", bReadyForPosting);
		},

		onStorageUnitNumberChange: function(oEvent) {
			var sStorageUnitNumber = oEvent.getParameter("value");

			sStorageUnitNumber = jQuery.sap.padLeft(sStorageUnitNumber, "0", 20);

			jQuery.sap.log.info("Start gathering data for palette " + sStorageUnitNumber);

			var fnResolve = function(oData) {
				var oStorageUnit = oData.d.results[0].Rowset.results[0].Row.results[0];
				this.getModel("data").setData(oStorageUnit);

				this.updateViewControls();
			}.bind(this);

			var fnReject = function(oError) {
				MessageBox.error("Lagereinheit " + sStorageUnitNumber + " ist unbekannt.\nBitte korrigieren!");
			}.bind(this);

			this._getStorageUnitInfo(sStorageUnitNumber).then(fnResolve, fnReject);
		},

		onSave: function() {
			this._postGoodsReceipt();
		},

		/*
		Resolve: 
		Materialnummer, Materialkurztext,  Lagerplatz, Lagertyp anzeigen. 
		Felder Lagerplatz, Charge,  
		Auftragsnummer, 
		Soll-Menge und 
		Mengeneinheit füllen. 
		 
		Lagerort "1000" füllen readonly  
		Auftragsnummer füllen readonly 
		 
		Reject: 
		Fehlermeldung "Palette nicht gefunden" 
		*/
		//SUMISA/Scanner/Umlagerung/trx_ReadPaletteInfo 
		_getStorageUnitInfo: function(sStorageUnitNumber) {

			var oModel = this.getModel("storageUnit"),
				oParam = {
					"Param.1": sStorageUnitNumber
				};

			return oModel.loadMiiData(oModel._sServiceUrl, oParam);
		},

		//SUMISA/Production/trx_GoodsMovementToSap 
		_postGoodsReceipt: function() {

		},

		isInputDataValid: function(oData) {
			if (oData) {
				return !!oData.AUFNR && !!oData.SOLLME && !!oData.MEINH && !!oData.LGORT && ((!!oData.LENUM && oData.LGORT === "1000") || (!oData.LENUM && oData.LGORT !== "1000"));
			} else {
				return false;
			}
		},

		/**
		 * Check is a given storage location is allowed for posting
		 */
		isStorageLocationAllowed: function(sStorageLocation) {
			return _aDisallowedStorageLocations.indexOf(sStorageLocation) === -1;
		},
		onOrderNumberChange: function(oEvent) {
			this.updateViewControls();
		},
		onQuantityChange: function(oEvent) {
			this.updateViewControls();
		},
		onUnitOfMeasureChange: function(oEvent) {
			this.updateViewControls();
		},
		onStorageLocationChange: function(oEvent) {
			var sStorageLocation = oEvent.getParameter("value");
			if (!this.isStorageLocationAllowed(sStorageLocation)) {
				oEvent.getSource().setValue("");
				MessageBox.error("Lagerort " + sStorageLocation + " ist nicht für Buchungen vorgesenen.\nBitte korrigieren!");
			}

			this.updateViewControls();
		},

		onClearFormPress: function() {
			this.getModel("data").setData(jQuery.extend(_oInitData));
		}
	});
});