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

		_aWarningLikeFatalError: ["EZMII_MESSAGES030:", "EZMII_MESSAGES031:", "EZMII_MESSAGES032:", "EZMII_MESSAGES033:", "EZMII_MESSAGES034:"],

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

			this.setModel(new JSONModel(jQuery.extend({}, this._oInitData)), "data");

			this.setModel(new JSONModel(jQuery.extend({}, this._oInitView)), "view");
		},

		onSave: function(oEvent) {
			var bPerformGoodsReceipt = this._isGoodsReceiptRequired(),
				doPosting, //Promise
				fnResolveStockTransfer,
				fnRejectStockTransfer,
				fnResolveGoodsReceipt,
				fnRejectGoodsReceipt,
				fnReject;

			this.getOwnerComponent().showBusyIndicator();

			fnResolveGoodsReceipt = function(oData) {
				var oStorageUnitNumber,
					aRows,
					bHasWarningLikeError;

				if (!oData.success) {

					bHasWarningLikeError = this._aWarningLikeFatalError.some(function(sMessage) {
						return oData.lastErrorMessage.includes(sMessage);
					});

					if (bHasWarningLikeError) {
						this.addUserMessage({
							text: oData.lastErrorMessage.substring(19, oData.lastErrorMessage.length),
							type: sap.ui.core.MessageType.Warning
						});
					} else {
						throw new Error(oData.lastErrorMessage + " @BwA 101");
					}
				}

				aRows = oData.d.results[0].Rowset.results[0].Row.results;

				/* Check if oData contains required results: extract value, evaluate value, set UI, set model data */
				if (aRows.length === 1) {
					oStorageUnitNumber = aRows[0];
				} else {
					throw new Error(this.getTranslation("stockTransfer.messageText.resultIncomplete") + " @BwA 101");
				}

				this.addMessageManagerMessage("Wareneingang von Palette  " + oStorageUnitNumber.LENUM + "  erfolgreich.");

			}.bind(this);

			fnResolveStockTransfer = function(oData) {
				var oStorageUnitNumber,
					aRows = oData.d.results[0].Rowset.results[0].Row.results,
					oDataModel = this.getModel("data"),
					sSuccessMessage;

				/* Check if oData contains required results: extract value, evaluate value, set UI, set model data */
				if (aRows.length === 1) {
					oStorageUnitNumber = aRows[0];

					if (bPerformGoodsReceipt) {
						sSuccessMessage = this.getTranslation("stockTransfer.messageText.postingWithGoodsReceiptSuccessfull", [oDataModel.getProperty("/storageUnit"), oDataModel.getProperty("/storageBin")]);
					} else {
						sSuccessMessage = this.getTranslation("stockTransfer.messageText.postingSuccessfull", [oDataModel.getProperty("/storageUnit"), oDataModel.getProperty("/storageBin")]);
					}

					this.addUserMessage({
						text: sSuccessMessage,
						type: sap.ui.core.MessageType.Success
					}, true);

				} else {
					throw new Error(this.getTranslation("stockTransfer.messageText.resultIncomplete") + " @BwA 999");
				}

				this.addMessageManagerMessage("Umbuchung von Palette " + oStorageUnitNumber.LENUM + " erfolgreich.");

			}.bind(this);

			fnRejectGoodsReceipt = function(oError) {
				MessageBox.error(oError.message, {
					title: this.getTranslation("error.miiTransactionErrorText")
				});
				throw oError; //re-throw
			}.bind(this);

			fnRejectStockTransfer = function(oError) {
				MessageBox.error(oError.message, {
					title: this.getTranslation("error.miiTransactionErrorText")
				});
				throw oError; //re-throw
			}.bind(this);

			fnReject = function(oError) {
				this.addUserMessage({
					text: oError.message
				});
			}.bind(this);

			if (bPerformGoodsReceipt) {
				doPosting = this._postGoodsReceipt()
					.then(fnResolveGoodsReceipt, fnRejectGoodsReceipt);
			} else {
				doPosting = Promise.resolve();
			}

			doPosting.then(this._postStockTransfer.bind(this))
				.then(fnResolveStockTransfer, fnRejectStockTransfer)
				.catch(fnReject)
				.then(this.getOwnerComponent().hideBusyIndicator)
				.then(function() {
					this.onClearFormPress({}, true /*bKeepMessageStrip*/ );
				}.bind(this));

		},

		_postStockTransfer: function() {
			var sPath = "/",
				oDataModel = this.getModel("data"),
				oStockTransferModel = this.getModel("goodsMovement"),
				sUsername = this.getModel("user").getProperty("/USERLOGIN"),
				sDefaultMoveType = "999",
				sDefaultUnitOfMeasure = "KG",
				oParam,
				oStorageBinItem = this.byId("storageBinSelection").getSelectedItem(),
				oStorageBinData = oStorageBinItem.data();

			if (oDataModel.getProperty(sPath + "storageBin") === "BA01" || oDataModel.getProperty(sPath + "storageBin") === "BA02") {
				oDataModel.setProperty(sPath + "BWART", "311");
				oDataModel.setProperty(sPath + "NLTYP", "");

				this.addMessageManagerMessage("Lagerplatz " + oDataModel.getProperty(sPath + "storageBin") + ": Bewegungsart 311 aktiv.");
			}

			oParam = {
				"Param.1": oDataModel.getProperty(sPath + "LENUM"),
				"Param.3": oDataModel.getProperty(sPath + "LGORT") || "",
				"Param.4": oDataModel.getProperty(sPath + "entryQuantity"),
				"Param.5": oDataModel.getProperty(sPath + "MEINH") || sDefaultUnitOfMeasure,
				"Param.6": oDataModel.getProperty(sPath + "MATNR"),
				"Param.10": sUsername,
				"Param.11": oDataModel.getProperty(sPath + "BWART") || sDefaultMoveType,
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
				oGoodsReceiptModel = this.getModel("goodsMovement"),
				sUsername = this.getModel("user").getProperty("/USERLOGIN"),
				sDefaultMoveType = "101",
				sDefaultUnitOfMeasure = "KG",
				oParam;

			oParam = {
				"Param.1": oDataModel.getProperty(sPath + "LENUM"),
				"Param.2": oDataModel.getProperty(sPath + "AUFNR"),
				"Param.4": oDataModel.getProperty(sPath + "entryQuantity"),
				"Param.5": oDataModel.getProperty(sPath + "MEINH") || sDefaultUnitOfMeasure,
				"Param.10": sUsername,
				"Param.11": oDataModel.getProperty(sPath + "BWART") || sDefaultMoveType
			};

			return oGoodsReceiptModel.loadMiiData(oGoodsReceiptModel._sServiceUrl, oParam);
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
		},

		_isGoodsReceiptRequired: function() {
			return this.formatter.isEmptyStorageUnit(this.getModel("data").getProperty("/ISTME"));
		},

		onStorageUnitInputChange: function(oEvent) {
			var oSource = oEvent.getSource(),
				sStorageUnitNumber = oEvent.getParameter("value"),
				fnResolve,
				fnReject;

			/* check if current input is valid */
			if (this.controlHasValidationError(oSource)) {
				return;
			}

			/* Prepare UI: busy, value states, log messages */
			this.showControlBusyIndicator(oSource);
			oSource.setValueState(sap.ui.core.ValueState.None);

			/* Prepare Data */
			sStorageUnitNumber = this.padStorageUnitNumber(sStorageUnitNumber);

			fnResolve = function(oData) {
				var oStorageUnit = {
						LENUM: null
					},
					oDataModel = this.getModel("data"),
					bMergeData = true,
					aRows = oData.d.results[0].Rowset.results[0].Row.results;

				if (aRows.length === 1) {
					oStorageUnit = aRows[0];
					oSource.setValueState(sap.ui.core.ValueState.Success);

					if (this.formatter.isEmptyStorageUnit(oStorageUnit.ISTME)) {
						oDataModel.setProperty("/entryQuantity", null);
						this.byId("quantityInput").focus();
					} else {
						oDataModel.setProperty("/entryQuantity", oStorageUnit.ISTME);
					}

				} else {
					this.addUserMessage({
						text: this.getTranslation("stockTransfer.messageText.storageUnitNotFound", [sStorageUnitNumber]),
						type: sap.ui.core.MessageType.Error
					});
					oSource.setValueState(sap.ui.core.ValueState.Error);
				}

				oDataModel.setData(oStorageUnit, bMergeData);

			}.bind(this);

			fnReject = function(oError) {
				MessageBox.error(oError.message, {
					title: this.getTranslation("error.miiTransactionErrorText", ["StorageUnitNumberRead"])
				});
			}.bind(this);

			/* Perform service call, Hide Busy Indicator, Update View Controls */
			this.requestStorageUnitInfoService(sStorageUnitNumber)
				.then(fnResolve, fnReject)
				.then(function() {
					this.hideControlBusyIndicator(oSource);
				}.bind(this))
				.then(function() {
					this.updateViewControls(this.getModel("data").getData());
				}.bind(this));

		},

		onStorageBinSelectionChange: function(oEvent) {
			this.updateViewControls(this.getModel("data").getData());
		},

		onQuantityChange: function(oEvent) {
			this.updateViewControls(this.getModel("data").getData());
		}
	});
});