sap.ui.define([
	"./ActionBaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"com/mii/scanner/model/sapType",
	"com/mii/scanner/model/formatter"
], function(ActionBaseController, JSONModel, MessageBox, sapType, formatter) {
	"use strict";

	return ActionBaseController.extend("com.mii.scanner.controller.action.GoodsReceipt", {

		sapType: sapType,
		formatter: formatter,

		_aDisallowedStorageLocations: ["VG01"],

		_sStorageLocationWarehouse: "1000",
		_sDefaultUnitOfMeasure: "KG",

		_oInitData: {
			LENUM: null,
			AUFNR: null,
			SOLLME: null,
			MEINH: null,
			LGORT: null,
			BESTQ: null
		},

		_oInitView: {
			bStorageUnitValid: true,
			bOrderNumberValid: true,
			bValid: false,
			storageUnitNumberValueState: sap.ui.core.ValueState.None,
			orderNumberValueState: sap.ui.core.ValueState.None
		},

		onInit: function() {
			//call super class onInit to apply user login protection. DO NOT DELETE!
			ActionBaseController.prototype.onInit.call(this);

			var oModel = new JSONModel(),
				oData;

			jQuery(document).on("scannerDetectionComplete", this.handleBarcodeScanned.bind(this));

			oData = jQuery.extend({}, this._oInitData);
			oModel.setData(oData);
			this.setModel(oModel, "data");

			this.setModel(new JSONModel(jQuery.extend({}, this._oInitView)), "view");

			this.getRouter()
				.getRoute("goodsReceipt")
				.attachMatched(this._onRouteMatched, this);
		},

		handleBarcodeScanned: function(oEvent, oData) {
			var sScannedString = oData.string,
				oScannerInputType,
				oControl;

			oScannerInputType = this.getScannerInputType(sScannedString);

			if (oScannerInputType) {
				jQuery.sap.log.info("Barcode enthält folgende Information: \'" + sScannedString + "\' Sie haben \'" + oScannerInputType.name + "\' gescannt.");
				// TODO: remove message box
				MessageBox.information("Barcode enthält folgende Information: \'" + sScannedString + "\' Sie haben \'" + oScannerInputType.name + "\' gescannt.");
				oControl = this.getControlByScannerInputType(oScannerInputType);
				if (oControl) {
					oControl.fireChangeEvent(sScannedString);
				}
			} else {
				jQuery.sap.log.warning("Ihr Barcode konnte zwar gelesen, aber nicht zugeordnet werden.\nInhalt: \'" + sScannedString + "\'");
				// TODO: remove message box
				MessageBox.warning("Ihr Barcode konnte zwar gelesen, aber nicht zugeordnet werden.\nInhalt war: \'" + sScannedString + "\'");
			}

		},

		_onRouteMatched: function(oEvent) {
			var oArgs, oView, oQuery;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();

			oQuery = oArgs["?query"];

			if (oQuery) {
				if (oQuery.type) {
					oView.getModel("view").setProperty("/type", oQuery.type);
				}
				if (oQuery.LENUM) {
					oView.getModel("data").setProperty("/LENUM", oQuery.LENUM);
					this.byId("storageUnitInput").fireChange({
						value: oQuery.LENUM
					});
				}
				if (oQuery.AUFNR) {
					oView.getModel("data").setProperty("/AUFNR", oQuery.AUFNR);
					this.byId("orderNumberInput").fireChange({
						value: oQuery.AUFNR
					});
				}
				if (oQuery.MEINH) {
					oView.getModel("data").setProperty("/MEINH", oQuery.MEINH);
					this.byId("unitOfMeasureInput").fireChange({
						value: oQuery.MEINH
					});
				}
				if (oQuery.LGORT) {
					oView.getModel("data").setProperty("/LGORT", oQuery.LGORT);
					this.byId("storageLocationInput").fireChange({
						value: oQuery.LGORT
					});
				}
			}
		},

		getControlByScannerInputType: function(oInputType) {
			return this.getIdByInputType(oInputType);
		},

		getIdByInputType: function(oInputType) {
			switch (oInputType.key) {
				case "LENUM":
					return this.byId("storageUnitInput");
				case "LGORT":
					return this.byId("storageLocationInput");
				case "AUFNR_VORNR":
					return this.byId("orderNumberInput");
				default:
					return null;
			}
		},

		updateViewControls: function(oData) {
			var oViewModel = this.getModel("view"),
				bStorageUnitValid = oViewModel.getProperty("/bStorageUnitValid"),
				bOrderNumberValid = oViewModel.getProperty("/bOrderNumberValid"),
				bInputValuesComplete,
				bNoErrorMessagesActive,
				bReadyForPosting;

			// check if all required input data is present
			bInputValuesComplete = this.isInputDataValid(oData);

			// check if all input data has proper format
			bNoErrorMessagesActive = this.isMessageModelClean();

			// we are ready for posting once we have complete and proper formatted input
			bReadyForPosting = bNoErrorMessagesActive && bInputValuesComplete && bStorageUnitValid && bOrderNumberValid;

			oViewModel.setProperty("/bValid", bReadyForPosting);
		},

		onStorageUnitNumberChange: function(oEvent) {
			var oSource = oEvent.getSource(),
				sStorageUnitNumber = oEvent.getParameter("value"),
				oBundle = this.getResourceBundle(),
				fnResolve,
				fnReject;

			sStorageUnitNumber = this._padStorageUnitNumber(sStorageUnitNumber);

			jQuery.sap.log.info("Start gathering data for palette " + sStorageUnitNumber);

			oSource.setValueState(sap.ui.core.ValueState.None);
			this.showControlBusyIndicator(oSource);

			this.clearLogMessages();

			fnResolve = function(oData) {
				var oStorageUnit,
					bStorageUnitValid = true,
					aResultList;

				try {

					aResultList = oData.d.results[0].Rowset.results[0].Row.results;

					if (aResultList.length === 1) {
						oStorageUnit = this._formatStorageUnitData(oData.d.results[0].Rowset.results[0].Row.results[0]);
						oSource.setValueState(sap.ui.core.ValueState.Success);
					} else {
						bStorageUnitValid = false;
						throw oBundle.getText("messageTitleStorageUnitNotFound");
					}

					if (oStorageUnit.SOLLME <= 0) {
						this.addLogMessage({
							text: oBundle.getText("messageTextStorageUnitAlreadyPosted", [sStorageUnitNumber])
						});
						oSource.setValueState(sap.ui.core.ValueState.Error);
						bStorageUnitValid = false;
					}

					this.getModel("data").setData(oStorageUnit);

				} catch (err) {
					MessageBox.error(oBundle.getText("messageTextStorageUnitNotFound", [sStorageUnitNumber]), {
						title: err
					});
					oSource.setValueState(sap.ui.core.ValueState.Error);
				} finally {
					this.getModel("view").setProperty("/bStorageUnitValid", bStorageUnitValid);
					this.updateViewControls(this.getModel("data").getData());
				}

			}.bind(this);

			fnReject = function(oError) {
				MessageBox.error(oBundle.getText("messageTextGoodsReceiptError"));
			}.bind(this);

			this.requestStorageUnitInfoService(sStorageUnitNumber)
				.then(fnResolve, fnReject)
				.then(function() {
					this.hideControlBusyIndicator(oSource);
				}.bind(this));
		},

		onSave: function() {
			var oBundle = this.getResourceBundle(),
				fnResolve,
				fnReject;

			this.getOwnerComponent().showBusyIndicator();

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

			this._postGoodsReceipt()
				.then(fnResolve, fnReject)
				.then(this.getOwnerComponent()
					.hideBusyIndicator);

		},

		//SUMISA/Production/trx_GoodsMovementToSap 
		//http://su-mii-dev01.intern.suwelack.de:50000/XMII/IlluminatorOData/QueryTemplate?QueryTemplate=SAPUI5/services/goodsmovement/GoodsMovementCreateXac&$format=json&Param.1=00000000109330000003&Param.2=1093300&Param.4=600&Param.5=KG&Param.10=phigem&Param.11=101
		_postGoodsReceipt: function() {

			var sPath = "/",
				oDataModel = this.getModel("data"),
				oGoodsReceiptModel = this.getModel("goodsMovement"),
				sUsername = this.getModel("user").getProperty("USERLOGIN"),
				sDefaultPlant = this._sStorageLocationWarehouse,
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
					"Param.10": sUserName,
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
					"Param.10": sUserName,
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
			return !!oData.AUFNR && !!oData.SOLLME && oData.SOLLME > 0 && oData.SOLLME !== "" && !!oData.MEINH && !!oData.LGORT && ((!!oData.LENUM && oData.LGORT === this._sStorageLocationWarehouse) || (!oData.LENUM && oData.LGORT !== this._sStorageLocationWarehouse));
		},

		onOrderNumberChange: function(oEvent) {
			var oSource = oEvent.getSource(),
				sOrderNumber = oEvent.getParameter("value"),
				oBundle = this.getResourceBundle(),
				fnResolve,
				fnReject;

			oSource.setValueState(sap.ui.core.ValueState.None);

			this.clearLogMessages();

			this.showControlBusyIndicator(oSource);

			fnResolve = function(oData) {
				var aResultList,
					bOrderNumberValid = true,
					oModel = this.getModel("data");

				if (oData.d.results[0].Rowset.results.length > 0) {
					aResultList = oData.d.results[0].Rowset.results[0].Row.results;
				}

				if (aResultList && aResultList.length === 1) {
					oSource.setValueState(sap.ui.core.ValueState.Success);
				} else {
					oSource.setValueState(sap.ui.core.ValueState.Error);
					this.addLogMessage({
						text: oBundle.getText("messageTextGoodsReceiptOrderNumberNotFoundError", [sOrderNumber])
					});
					bOrderNumberValid = false;
				}

				this.getModel("view").setProperty("/bOrderNumberValid", bOrderNumberValid);
				this.updateViewControls(oModel.getData());

			}.bind(this);

			fnReject = function(oError) {
				MessageBox.error(oBundle.getText("messageTextGoodsReceiptError"));
			}.bind(this);

			this.requestOrderHeaderInfoService(sOrderNumber)
				.then(fnResolve, fnReject)
				.then(function() {
					this.hideControlBusyIndicator(oSource);
				}.bind(this));

		},
		onQuantityChange: function(oEvent) {
			this.updateViewControls(this.getModel("data")
				.getData());
		},
		onUnitOfMeasureChange: function(oEvent) {
			var sUnitOfMeasure = oEvent.getParameter("value").toUpperCase(),
				oDataModel = this.getModel("data");

			oDataModel.setProperty("/MEINH", sUnitOfMeasure);

			this.updateViewControls(this.getModel("data").getData());
		},
		onStorageLocationChange: function(oEvent) {
			var sStorageLocation = oEvent.getParameter("value").toUpperCase(),
				oBundle = this.getResourceBundle(),
				oDataModel = this.getModel("data");

			// check if storage location is allowed
			if (!this.isStorageLocationAllowed(sStorageLocation)) {
				//oEvent.getSource().setValue("");
				MessageBox.error(oBundle.getText("messageTextWrongStorageLocation", [sStorageLocation]));
			}

			// propose default unit of measure if storage location is not 1000 and uom was not entered before 
			// clear unit of measure if storage location is 1000
			if (sStorageLocation !== this._sStorageLocationWarehouse && !oDataModel.getProperty("/MEINH")) {
				oDataModel.setProperty("/MEINH", this._sDefaultUnitOfMeasure);
			} else if (sStorageLocation === this._sStorageLocationWarehouse) {
				oDataModel.setProperty("/MEINH", null);
			}

			this.updateViewControls(this.getModel("data").getData());
		}

	});
});