sap.ui.define([
	"./ActionBaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"com/mii/scanner/model/sapType"
], function(ActionBaseController, JSONModel, MessageBox, sapType) {
	"use strict";

	return ActionBaseController.extend("com.mii.scanner.controller.action.GoodsReceipt", {

		sapType: sapType,

		_aDisallowedStorageLocations: ["VG01"],

		_oInitData: {
			LENUM: null,
			AUFNR: null,
			SOLLME: 0.0,
			MEINH: null,
			LGORT: null,
			INFO: null
		},

		onInit: function() {
			var oModel = new JSONModel(),
				oData;

			oData = jQuery.extend({}, this._oInitData);
			oModel.setData(oData);
			this.setModel(oModel, "data");

			this._oInitView = {
				bStorageUnitValid: true,
				bValid: false
			};
			this.setModel(new JSONModel(jQuery.extend({}, this._oInitView)), "view");

			jQuery(document).on("scannerDetectionComplete", this.handleBarcodeScanned.bind(this));

		},

		handleBarcodeScanned: function(oEvent, oData) {
			var sScannedString = oData.string,
				oScannerInputType,
				oControl;

			oScannerInputType = this.getScannerInputType(sScannedString);

			if (oScannerInputType) {
				jQuery.sap.log.info("Barcode enthält folgende Information: \'" + sScannedString + "\' Sie haben \'" + oScannerInputType.name + "\' gescannt.");
				oControl = this.getControlByScannerInputType(oScannerInputType);
				//oControl.setValue(sScannedString);
				oControl.fireChangeEvent(sScannedString);
			} else {
				jQuery.sap.log.warning("Ihr Barcode konnte zwar gelesen, aber nicht zugeordnet werden.\nInhalt: \'" + sScannedString + "\'");
			}

		},

		getControlByScannerInputType: function(oInputType) {
			return this.getIdByInputType(oInputType);
		},

		getIdByInputType: function(oInputType) {
			switch (oInputType.key) {
				case "LENUM":
					return this.byId("storageUnitInput");
					break;
				default:
					return null;
			}
		},

		updateViewControls: function(oData) {
			var oViewModel = this.getModel("view"),
				bInputValuesComplete,
				bNoErrorMessagesActive,
				bReadyForPosting;

			// check if all required input data is present
			bInputValuesComplete = this.isInputDataValid(oData);

			// check if all input data has proper format
			bNoErrorMessagesActive = this.isMessageModelClean();

			// we are ready for posting once we have complete and proper formatted input
			bReadyForPosting = bNoErrorMessagesActive && bInputValuesComplete;

			oViewModel.setProperty("/bValid", bReadyForPosting);
		},

		onStorageUnitNumberChange: function(oEvent) {
			var sStorageUnitNumber = oEvent.getParameter("value"),
				oBundle = this.getResourceBundle();

			sStorageUnitNumber = this._padStorageUnitNumber(sStorageUnitNumber);

			jQuery.sap.log.info("Start gathering data for palette " + sStorageUnitNumber);

			this.clearLogMessages();

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

					if (oStorageUnit.SOLLME <= 0) {
						this.addLogMessage({
							text: "LE \'" + sStorageUnitNumber + "\' wurde bereits gebucht!"
						});
						this.getModel("view").setProperty("/bStorageUnitValid", false);
					} else {
						this.getModel("view").setProperty("/bStorageUnitValid", true);
					}

					this.getModel("data").setData(oStorageUnit);

					this.updateViewControls(this.getModel("data").getData());

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
		//http://su-mii-dev01.intern.suwelack.de:50000/XMII/IlluminatorOData/QueryTemplate?QueryTemplate=SAPUI5/services/goodsmovement/GoodsMovementCreateXac&$format=json&Param.1=00000000109330000003&Param.2=1093300&Param.4=600&Param.5=KG&Param.10=phigem&Param.11=101
		_postGoodsReceipt: function() {
			var werk = EscapeSQLString(document.getElementById("werk").value);
			var matNr = EscapeSQLString(document.getElementById('matNr').value);
			var menge = formatDecimalForSAP(document.getElementById('txtMenge').value);
			var meins = EscapeSQLString(document.getElementById('txtMEINS').value);
			var auftragNr = document.getElementById("txtAuftrag").value;
			var paletteNr = EscapeSQLString(document.getElementById("txtPalette").value);
			var lgort = EscapeSQLString(document.getElementById('txtLgOrt').value);

			var queryString = "/XMII/Runner?Transaction=SUMISA/Production/trx_GoodsMovementToSap";
			queryString += "&BWART=" + bwArt;

			if (paletteNr === "") {
				// Keine LE-Nr angegeben
				queryString += "&AUFNR=" + auftragNr;
				queryString += "&MATNR=" + matNr;
				queryString += "&MENGE=" + menge;
				queryString += "&MEINS=" + meins;
				queryString += "&LGORT=" + lgort;
				queryString += "&UNAME=" + loginID;
				queryString += "&OutputParameter=ERROR";
				queryString += "&Content-Type=text/xml";
			} else {
				// LE-Nr angegeben
				queryString += "&AUFNR=" + auftragNr;
				queryString += "&LENUM=" + paletteNr;
				queryString += "&MATNR=" + document.getElementById('matNrLE').value;
				queryString += "&MENGE=" + menge;
				queryString += "&MEINS=" + meins;
				queryString += "&UNAME=" + loginID;
				queryString += "&OutputParameter=ERROR";
				queryString += "&Content-Type=text/xml";
			}

			return loadXML(queryString);
		},

		isInputDataValid: function(oData) {
			if (oData) {
				return !!oData.AUFNR && !!oData.SOLLME && !!oData.MEINH && !!oData.LGORT && ((!!oData.LENUM && oData.LGORT === "1000") || (!oData.LENUM && oData.LGORT !== "1000"));
			} else {
				return false;
			}
		},

		isMessageModelClean: function() {
			var oMessageModel = sap.ui.getCore().getMessageManager().getMessageModel(),
				aMessages = oMessageModel.getData();

			if (aMessages && aMessages.length > 0) {
				return false;
			} else {
				return true;
			}
		},

		/**
		 * Check is a given storage location is allowed for posting
		 */
		isStorageLocationAllowed: function(sStorageLocation) {
			return this._aDisallowedStorageLocations.indexOf(sStorageLocation) === -1;
		},
		onOrderNumberChange: function(oEvent) {
			this.updateViewControls(this.getModel("data").getData());
		},
		onQuantityChange: function(oEvent) {
			this.updateViewControls(this.getModel("data").getData());
		},
		onUnitOfMeasureChange: function(oEvent) {
			this.updateViewControls(this.getModel("data").getData());
		},
		onStorageLocationChange: function(oEvent) {
			var sStorageLocation = oEvent.getParameter("value").toUpperCase(),
				oBundle = this.getResourceBundle();

			if (!this.isStorageLocationAllowed(sStorageLocation)) {
				//oEvent.getSource().setValue("");
				MessageBox.error(oBundle.getText("messageTextWrongStorageLocation", [sStorageLocation]));
			}

			this.updateViewControls(this.getModel("data").getData());
		},

		onClearFormPress: function() {
			var oNewInitialData = jQuery.extend({}, this._oInitData),
				oDataModel = this.getModel("data"),
				oNewInitialView = jQuery.extend({}, this._oInitView),
				oViewModel = this.getModel("view");

			oDataModel.setProperty("/", oNewInitialData);
			// force update to also override invalid values
			oDataModel.updateBindings(true);

			oViewModel.setProperty("/", oNewInitialView);

			this.clearLogMessages();

		},

		_padStorageUnitNumber: function(sStorageUnitNumber) {
			return jQuery.sap.padLeft(sStorageUnitNumber, "0", 20);
		}

	});
});