sap.ui.define([
	"./ActionBaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"com/mii/scanner/model/sapType"
], function(ActionBaseController, JSONModel, MessageBox, sapType) {
	"use strict";

	return ActionBaseController.extend("com.mii.scanner.controller.action.GoodsReceipt", {

		sapType: sapType,

		onInit: function() {
			var oModel = new JSONModel(),
				oData;

			this._aDisallowedStorageLocations = ["VG01"];

			this._oInitData = {
				LENUM: null,
				AUFNR: null,
				SOLLME: 0.0,
				MEINH: null,
				LGORT: '',
				INFO: null
			};

			oData = jQuery.extend(this._oInitData);
			oModel.setData(oData);
			this.setModel(oModel, "data");

			this.setModel(new JSONModel({
				bValid: false
			}), "view");
		},

		updateViewControls: function() {
			var oModel = this.getModel("view"),
				bReadyForPosting;
			bReadyForPosting = this.isInputDataValid(oModel.getData());

			oModel.setProperty("/bValid", bReadyForPosting);
		},

		onStorageUnitNumberChange: function(oEvent) {
			var sStorageUnitNumber = oEvent.getParameter("value"),
				oBundle = this.getResourceBundle();

			sStorageUnitNumber = this._padStorageUnitNumber(sStorageUnitNumber);

			jQuery.sap.log.info("Start gathering data for palette " + sStorageUnitNumber);

			var fnResolve = function(oData) {
				var oStorageUnit,
					sResultList;

				try {

					sResultList = oData.d.results[0].Rowset.results[0].Row.results;
					if (sResultList.length === 1) {
						oStorageUnit = this._formatStorageUnitData(oData.d.results[0].Rowset.results[0].Row.results[0]);
					} else {

						throw oBundle.getText("messageTitleStorageUnitNotFound");
					}

					this.getModel("data").setData(oStorageUnit);

					this.updateViewControls();

				} catch (err) {
					MessageBox.error(oBundle.getText("messageTextStorageUnitNotFound", [sStorageUnitNumber]), {
						title: err
					});

				} finally {}

			}.bind(this);

			var fnReject = function(oError) {

			}.bind(this);

			this._getStorageUnitInfo(sStorageUnitNumber).then(fnResolve, fnReject);
		},

		_formatStorageUnitData: function(oStorageUnit) {

			if (!oStorageUnit) {
				return null;
			}

			var fnNumberOrDefault = function(vAttr, vDefault) {
				return jQuery.isNumeric(vAttr) ? Number(vAttr) : vDefault;
			};

			oStorageUnit.LENUM = fnNumberOrDefault(oStorageUnit.LENUM, null);
			oStorageUnit.SOLLME = fnNumberOrDefault(oStorageUnit.SOLLME, 0.0);

			return oStorageUnit;
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
			return this._aDisallowedStorageLocations.indexOf(sStorageLocation) === -1;
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
			var sStorageLocation = oEvent.getParameter("value").toUpperCase(),
				oBundle = this.getResourceBundle();
			if (!this.isStorageLocationAllowed(sStorageLocation)) {
				//oEvent.getSource().setValue("");
				MessageBox.error(oBundle.getText("messageTextWrongStorageLocation", [sStorageLocation]));
			}

			this.updateViewControls();
		},

		onClearFormPress: function() {
			this.getModel("data").setData(jQuery.extend(this._oInitData));
			this.updateViewControls();
		},

		_padStorageUnitNumber: function(sStorageUnitNumber) {
			return jQuery.sap.padLeft(sStorageUnitNumber, "0", 20);
		}

	});
});