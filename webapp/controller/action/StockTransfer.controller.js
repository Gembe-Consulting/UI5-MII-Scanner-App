sap.ui.define([
	"./ActionBaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"com/mii/scanner/model/sapType",
	"com/mii/scanner/model/formatter"
], function(ActionBaseController, JSONModel, MessageBox, sapType, formatter) {
	"use strict";

	return ActionBaseController.extend("com.mii.scanner.controller.action.StockTransfer", {

		sapType: sapType,

		formatter: formatter,

		_oInitData: {
			//user input data
			storageUnit: null,
			entryQuantity: null,
			storageBin: null,
			//external data
			LENUM: null
		},

		_oInitView: {
			bValid: false,
			storageUnitInputValueState: sap.ui.core.ValueState.None
		},

		onInit: function() {
			//call super class onInit to apply user login protection. DO NOT DELETE!
			ActionBaseController.prototype.onInit.call(this);

			var oModel = new JSONModel(),
				oData;

			//jQuery(document).on("scannerDetectionComplete", this.handleBarcodeScanned.bind(this));

			oData = jQuery.extend({}, this._oInitData);
			oModel.setData(oData);
			this.setModel(oModel, "data");

			this.setModel(new JSONModel(jQuery.extend({}, this._oInitView)), "view");
		},

		onStorageUnitInputChange: function(oEvent) {
			var oSource = oEvent.getSource(),
				sStorageUnitNumber = oEvent.getParameter("value"),
				oBundle = this.getResourceBundle(),
				fnResolve,
				fnReject;

			sStorageUnitNumber = this._padStorageUnitNumber(sStorageUnitNumber);

			oSource.setValueState(sap.ui.core.ValueState.None);

			this.showControlBusyIndicator(oSource);

			this.clearLogMessages();

			fnResolve = function(oData) {
				var oStorageUnit = {
						LENUM: null,
						AUFNR: null,
						ISTME: null,
						TARGETME: null,
						MEINH: null
					},
					oDataModel = this.getModel("data"),
					aResultList;

				try {

					aResultList = oData.d.results[0].Rowset.results[0].Row.results;

					if (aResultList.length === 1) {
						oStorageUnit = oData.d.results[0].Rowset.results[0].Row.results[0];
						oSource.setValueState(sap.ui.core.ValueState.Success);
					} else {
						this.addLogMessage({
							text: oBundle.getText("messageTextStockTransferStorageUnitNotFound", [sStorageUnitNumber]),
							type: sap.ui.core.MessageType.Error
						});
						oSource.setValueState(sap.ui.core.ValueState.Error);
					}

					oDataModel.setData(oStorageUnit, true);

					// remap same properties
					if (this.formatter.isEmptyStorageUnit(oStorageUnit.ISTME)) {
						oDataModel.setProperty("/entryQuantity", null);
						this.byId("quantityInput").focus();
					} else {
						oDataModel.setProperty("/entryQuantity", oStorageUnit.ISTME);
					}

				} catch (err) {
					MessageBox.error(oBundle.getText("messageTextStockTransferError"));
					oSource.setValueState(sap.ui.core.ValueState.Error);
				} finally {
					this.updateViewControls(this.getModel("data").getData());
				}

			}.bind(this);

			fnReject = function(oError) {
				MessageBox.error(oBundle.getText("messageTextStockTransferError"));
			}.bind(this);

			this.requestStorageUnitInfoService(sStorageUnitNumber)
				.then(fnResolve, fnReject)
				.then(function() {
					this.hideControlBusyIndicator(oSource);
				}.bind(this));

		},

		onSave: function(oEvent) {
			var oBundle = this.getResourceBundle(),
				bPerformGoodsReceipt = this._isGoodsReceiptRequired(),
				fnResolveStockTransfer,
				fnResolveGoodsReceipt,
				fnReject;

			this.getOwnerComponent().showBusyIndicator();

			fnResolveStockTransfer = function(oData) {
				var aResults,
					aMessages,
					sFatalError,
					oReturn,
					oDataModel = this.getModel("data"),
					sSuccessMessage;

				try {

					aResults = oData.d.results[0].Rowset.results;
					aMessages = oData.d.results[0].Messages.results;
					sFatalError = oData.d.results[0].FatalError;

					if (!sFatalError) {
						if (bPerformGoodsReceipt) {
							sSuccessMessage = oBundle.getText("messageTextStockTransferPostingWithGoodsReceiptSuccessfull", [oDataModel.getProperty("/storageUnit"), oDataModel.getProperty("/storageBin")]);
						} else {
							sSuccessMessage = oBundle.getText("messageTextStockTransferPostingSuccessfull", [oDataModel.getProperty("/storageUnit"), oDataModel.getProperty("/storageBin")]);
						}

						this.addLogMessage({
							text: sSuccessMessage,
							type: sap.ui.core.MessageType.Success
						});
					} else {
						this.addLogMessage({
							text: sFatalError,
							type: sap.ui.core.MessageType.Error
						});
					}

				} catch (err) {
					MessageBox.error(oBundle.getText("messageTextStockTransferPostingFailed"), {
						title: err
					});
				} finally {
					this.onClearFormPress({}, true /*bKeepMessageStrip*/ );
				}
				
			}.bind(this);

			fnResolveGoodsReceipt = function(oData) {
				var aResults,
					aMessages,
					sFatalError,
					oReturn,
					oDataModel = this.getModel("data");

				aResults = oData.d.results[0].Rowset.results;
				aMessages = oData.d.results[0].Messages.results;
				sFatalError = oData.d.results[0].FatalError;

				if (!sFatalError) {

				} else {
					this.addLogMessage({
						text: sFatalError,
						type: sap.ui.core.MessageType.Error
					});
					throw "sFatalError";
				}

			}.bind(this);

			fnReject = function(oError) {
				MessageBox.error(oBundle.getText("messageTextStockTransferError"));
			}.bind(this);

			if (bPerformGoodsReceipt) {
				this._postGoodsReceipt()
					.then(fnResolveGoodsReceipt, fnReject)
					.then(this._postStockTransfer.bind(this))
					.then(fnResolveStockTransfer, fnReject)
					.then(this.getOwnerComponent()
						.hideBusyIndicator);
			} else {
				this._postStockTransfer()
					.then(fnResolveStockTransfer, fnReject)
					.then(this.getOwnerComponent()
						.hideBusyIndicator);
			}

		},

		_postStockTransfer: function() {
			var sPath = "/",
				oDataModel = this.getModel("data"),
				oViewModel = this.getModel("view"),
				oStockTransferModel = this.getModel("goodsMovement"),
				sDefaultPlant = "1000",
				sDefaultMoveType = "999",
				sDefaultUnitOfMeasure = "KG",
				oParam,
				oStorageBinItem = this.byId("storageBinSelection").getSelectedItem(),
				oStorageBinData = oStorageBinItem.data();

			if (oDataModel.getProperty(sPath + "storageBin") === "BA01" || oDataModel.getProperty(sPath + "storageBin") === "BA02") {
				oDataModel.setProperty(sPath + "BWART", "311");
				oDataModel.setProperty(sPath + "NLTYP", "");
			}

			oParam = {
				"Param.1": oDataModel.getProperty(sPath + "LENUM"),
				//"Param.2": oDataModel.getProperty(sPath + "AUFNR"),
				"Param.3": oDataModel.getProperty(sPath + "LGORT") || "",
				"Param.4": oDataModel.getProperty(sPath + "entryQuantity"),
				"Param.5": oDataModel.getProperty(sPath + "MEINH") || sDefaultUnitOfMeasure,
				"Param.6": oDataModel.getProperty(sPath + "MATNR"),
				//"Param.7": oDataModel.getProperty(sPath + "batchNumber"),
				//"Param.8": oDataModel.getProperty(sPath + "bulkMaterialIndicator"),
				//"Param.9": oDataModel.getProperty(sPath + "operationNumber"),
				"Param.11": oDataModel.getProperty(sPath + "BWART") || sDefaultMoveType,
				//"Param.12": oDataModel.getProperty(sPath + "WERK") || sDefaultPlant,
				"Param.13": oDataModel.getProperty(sPath + "LGTYP"),
				"Param.14": oDataModel.getProperty(sPath + "LGPLA") || "",
				"Param.15": oDataModel.getProperty(sPath + "NLTYP") || oStorageBinData.storageType || "",
				"Param.16": oDataModel.getProperty(sPath + "storageBin")
			};

			return oStockTransferModel.loadMiiData(oStockTransferModel._sServiceUrl, oParam);
		},

		_postGoodsReceipt: function() {
			var sPath = "/",
				oDataModel = this.getModel("data"),
				oViewModel = this.getModel("view"),
				oGoodsReceiptModel = this.getModel("goodsMovement"),
				sDefaultPlant = "1000",
				sDefaultMoveType = "101",
				sDefaultUnitOfMeasure = "KG",
				oParam;

			oParam = {
				"Param.1": oDataModel.getProperty(sPath + "LENUM"),
				"Param.2": oDataModel.getProperty(sPath + "AUFNR"),
				//"Param.3": oDataModel.getProperty(sPath + "LGORT"),
				"Param.4": oDataModel.getProperty(sPath + "entryQuantity"),
				"Param.5": oDataModel.getProperty(sPath + "MEINH") || sDefaultUnitOfMeasure,
				//"Param.6": oDataModel.getProperty(sPath + "MATNR"),
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

			return oGoodsReceiptModel.loadMiiData(oGoodsReceiptModel._sServiceUrl, oParam);
		},

		_isGoodsReceiptRequired: function() {
			return this.formatter.isEmptyStorageUnit(this.getModel("data").getProperty("/ISTME"));
		},

		onStorageBinSelectionChange: function(oEvent) {
			this.updateViewControls(this.getModel("data").getData());
		},

		onQuantityChange: function(oEvent) {
			this.updateViewControls(this.getModel("data").getData());
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

		/**
		 * Posting is allowed when
		 * - Storage bin has been selected
		 * - Storage unit has been entered
		 * - Storage unit is valid
		 * - Quntity has been entered and is not zero
		 */
		isInputDataValid: function(oData) {
			return !!oData.storageBin && !!oData.storageUnit && !!oData.LENUM && !!oData.entryQuantity && oData.entryQuantity !== "" && !this.formatter.isEmptyStorageUnit(oData.entryQuantity);
		}
	});
});