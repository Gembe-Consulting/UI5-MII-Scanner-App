sap.ui.define([
	"./ActionBaseController",
	"sap/ui/model/json/JSONModel"
], function(ActionBaseController, JSONModel) {
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

		onStorageBinNumberChange: function(oEvent) {
			var sStorageBinNumber = oEvent.getParameter("value");

			sStorageBinNumber = jQuery.sap.padLeft(sStorageBinNumber, "0", 20);

			jQuery.sap.log.info("Start gathering data for palette " + sStorageBinNumber);

			var fnResolve = function(oData) {
				this.getModel("data").setProperty("/bValid", this.isInputDataValid());
				var oStorageBin = oData.d.results[0].Rowset.results[0].Row.results[0];
				this.getModel("data").setData(oStorageBin);
			}.bind(this);
			
			var fnReject = function(oError) {
				debugger;
			}.bind(this);

			this._getStorageBinInfo(sStorageBinNumber).then(fnResolve, fnReject);
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
		_getStorageBinInfo: function(sStorageBinNumber) {

			var oModel = this.getModel("storagebin"),
				oParam = {
					"Param.1": sStorageBinNumber
				};

			return oModel.loadMiiData(oModel._sServiceUrl, oParam);
		},

		//SUMISA/Production/trx_GoodsMovementToSap 
		_postGoodsReceipt: function() {

		},

		isInputDataValid: function() {
			var oData = this.getModel("data").getData();

			return oData.ORDER && oData.MENGE && oData.LGORT && oData.ME && ((oData.LENUM && oData.LGORT === "1000") || (!oData.LENUM && oData.LGORT !== "1000"));

		},

		/**
		 * Check is a given storage location is allowed for posting
		 */
		isStorageLocationAllowed: function(sStorageLocation) {
			return _aDisallowedStorageLocations.indexOf(sStorageLocation) === -1;
		},

		onClearFormPress: function() {
			this.getModel("data").setData(jQuery.extend(_oInitData));
		}
	});
});