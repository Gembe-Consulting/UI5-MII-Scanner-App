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

			jQuery(document).on("scannerDetectionComplete", this.handleBarcodeScanned.bind(this));

			oData = jQuery.extend({}, this._oInitData);
			oModel.setData(oData);
			this.setModel(oModel, "data");

			this._oInitView = {
				bStorageUnitValid: true,
				bValid: false
			};
			this.setModel(new JSONModel(jQuery.extend({}, this._oInitView)), "view");
		},

		handleBarcodeScanned: function(oEvent, oData) {
			var sScannedString = oData.string,
				oScannerInputType,
				oControl;

			oScannerInputType = this.getScannerInputType(sScannedString);

			if (oScannerInputType) {
				jQuery.sap.log.info("Barcode enthält folgende Information: \'" + sScannedString + "\' Sie haben \'" + oScannerInputType.name + "\' gescannt.");
				oControl = this.getControlByScannerInputType(oScannerInputType);
				if (oControl) {
					oControl.fireChangeEvent(sScannedString);
				}
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
					aResultList;

				try {

					aResultList = oData.d.results[0].Rowset.results[0].Row.results;

					if (aResultList.length === 1) {
						oStorageUnit = this._formatStorageUnitData(oData.d.results[0].Rowset.results[0].Row.results[0]);
					} else {
						throw oBundle.getText("messageTitleStorageUnitNotFound");
					}

					if (oStorageUnit.SOLLME <= 0) {
						this.addLogMessage({
							text: oBundle.getText("messageTextStorageUnitAlreadyPosted", [sStorageUnitNumber])
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
				MessageBox.error(oBundle.getText("messageTextGoodsReceiptError"));
			}.bind(this);

			this.requestStorageUnitInfoService(sStorageUnitNumber).then(fnResolve, fnReject);
		},

		onSave: function() {
			var oBundle = this.getResourceBundle(),
				fnResolve,
				fnReject;

			fnResolve = function(oData) {
				var aResults,
					aMessages,
					sFatalError,
					oReturn;

				try {

					aResults = oData.d.results[0].Rowset.results;
					aMessages = oData.d.results[0].Messages.results;
					sFatalError = oData.d.results[0].FatalError;

					if (!sFatalError) {
						this.addLogMessage({
							text: oBundle.getText("messageTextGoodsReceiptPostingSuccessfull"),
							type: sap.ui.core.MessageType.Success
						});
					} else {
						this.addLogMessage({
							text: sFatalError,
							type: sap.ui.core.MessageType.Error
						});
					}

				} catch (err) {
					MessageBox.error(oBundle.getText("messageTextGoodsReceiptPostingFailed"), {
						title: err
					});
				} finally {
					this.onClearFormPress({}, true /*bKeepMessageStrip*/ );
				}
			}.bind(this);

			fnReject = function(oError) {
				MessageBox.error(oBundle.getText("messageTextGoodsReceiptError"));
			}.bind(this);

			this._postGoodsReceipt().then(fnResolve, fnReject);

		},

		//SUMISA/Production/trx_GoodsMovementToSap 
		//http://su-mii-dev01.intern.suwelack.de:50000/XMII/IlluminatorOData/QueryTemplate?QueryTemplate=SAPUI5/services/goodsmovement/GoodsMovementCreateXac&$format=json&Param.1=00000000109330000003&Param.2=1093300&Param.4=600&Param.5=KG&Param.10=phigem&Param.11=101
		_postGoodsReceipt: function() {

			var sPath = "/",
				oDataModel = this.getModel("data"),
				oGoodsReceiptModel = this.getModel("goodsReceipt"),

				sDefaultPlant = "1000",
				sDefaultMoveType = "101",
				sDefaultUnitOfMeasure = "KG",

				oParam;

			if (oDataModel.getProperty(sPath + "LENUM")) {
				oParam = {
					"Param.1": oDataModel.getProperty(sPath + "LENUM"),
					"Param.2": oDataModel.getProperty(sPath + "AUFNR"),
					//"Param.3": oDataModel.getProperty(sPath + "LGORT"),
					"Param.4": oDataModel.getProperty(sPath + "SOLLME"),
					"Param.5": oDataModel.getProperty(sPath + "MEINH") || sDefaultUnitOfMeasure,
					"Param.6": oDataModel.getProperty(sPath + "MATNR"),
					//"Param.7": oDataModel.getProperty(sPath + "CHARG"),
					//"Param.8": oDataModel.getProperty(sPath + "SCHUETT"),
					//"Param.9": oDataModel.getProperty(sPath + "VORNR"),
					"Param.11": oDataModel.getProperty(sPath + "BWART") || sDefaultMoveType,
					//"Param.12": oDataModel.getProperty(sPath + "WERK") || sDefaultPlant,
					//"Param.13": oDataModel.getProperty(sPath + "LGTYP"),
					//"Param.14": oDataModel.getProperty(sPath + "LGPLA"),
					//"Param.15": oDataModel.getProperty(sPath + "NLTYP"),
					//"Param.16": oDataModel.getProperty(sPath + "NLPLA")
				};
			} else {
				oParam = {
					//"Param.1": oDataModel.getProperty(sPath + "LENUM"),
					"Param.2": oDataModel.getProperty(sPath + "AUFNR"),
					"Param.3": oDataModel.getProperty(sPath + "LGORT"),
					"Param.4": oDataModel.getProperty(sPath + "SOLLME"),
					"Param.5": oDataModel.getProperty(sPath + "MEINH") || sDefaultUnitOfMeasure,
					"Param.6": oDataModel.getProperty(sPath + "MATNR"),
					//"Param.7": oDataModel.getProperty(sPath + "CHARG"),
					//"Param.8": oDataModel.getProperty(sPath + "SCHUETT"),
					//"Param.9": oDataModel.getProperty(sPath + "VORNR"),
					"Param.11": oDataModel.getProperty(sPath + "BWART") || sDefaultMoveType,
					//"Param.12": oDataModel.getProperty(sPath + "WERK") || sDefaultPlant,
					//"Param.13": oDataModel.getProperty(sPath + "LGTYP"),
					//"Param.14": oDataModel.getProperty(sPath + "LGPLA"),
					//"Param.15": oDataModel.getProperty(sPath + "NLTYP"),
					//"Param.16": oDataModel.getProperty(sPath + "NLPLA")
				};
			}

			return oGoodsReceiptModel.loadMiiData(oGoodsReceiptModel._sServiceUrl, oParam);

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
		}

	});
});