sap.ui.define([
	"jquery.sap.global",
	"./BaseGMController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"com/mii/scanner/model/sapType",
	"com/mii/scanner/model/formatter"
], function(jQuery, BaseGMController, JSONModel, MessageBox, sapType, formatter) {
	"use strict";

	return BaseGMController.extend("com.mii.scanner.controller.action.gm.GoodsReceipt", {

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
			BaseGMController.prototype.onInit.call(this);

			this.setModel(new JSONModel(jQuery.extend({}, this._oInitData)), "data");

			this.setModel(new JSONModel(jQuery.extend({}, this._oInitView)), "view");

			this.getRouter()
				.getRoute("goodsReceipt")
				.attachMatched(this._onRouteMatched, this);
		},

		onSave: function() {
			var fnResolve,
				fnReject;

			/* Prepare UI: busy, value states, log messages */
			this.getOwnerComponent().showBusyIndicator();

			/* Prepare Data */

			/* Prepare success callback */
			fnResolve = function(oData) {
				var oStorageUnitNumber,
					aRows,
					iExactlyOne = 1;

				try {
					aRows = oData.d.results[0].Rowset.results[0].Row.results;
				} catch (oError) {
					aRows = [];
				}

				/* Check if oData contains required results: extract value, evaluate value, set UI, set model data */
				if (oData.success && aRows.length === iExactlyOne) {
					oStorageUnitNumber = aRows[0];
					this.addUserMessage({
						text: this.getTranslation("goodsReceipt.messageText.goodsReceiptPostingSuccessfull", [this.deleteLeadingZeros(
							oStorageUnitNumber.LENUM)]),
						type: sap.ui.core.MessageType.Success
					});
				} else if (!oData.success) {
					this.addUserMessage({
						text: oData.lastErrorMessage
					});
				} else {
					this.addUserMessage({
						text: this.getTranslation("goodsReceipt.messageText.resultIncomplete")
					});
				}
			}.bind(this);

			/* Prepare error callback */
			fnReject = function(oError) {
				this.addUserMessage({
					text: this.getTranslation("error.miiTransactionErrorText", ["GoodsMovementCreate: 101"])
				});
			}.bind(this);

			/* Perform service call, Hide Busy Indicator, Update View Controls */
			this._postGoodsReceipt()
				.then(fnResolve, fnReject)
				.then(this.getOwnerComponent().hideBusyIndicator)
				.then(function() {
					this.onClearFormPress({}, true /*bKeepMessageStrip*/ );
				}.bind(this));

		},

		//SUMISA/Production/trx_GoodsMovementToSap 
		//http://su-mii-dev01.intern.suwelack.de:50000/XMII/IlluminatorOData/QueryTemplate?QueryTemplate=SAPUI5/services/goodsmovement/GoodsMovementCreateXac&$format=json&Param.1=00000000109330000003&Param.2=1093300&Param.4=600&Param.5=KG&Param.10=phigem&Param.11=101
		_postGoodsReceipt: function() {

			var sPath = "/",
				oDataModel = this.getModel("data"),
				oGoodsReceiptModel = this.getModel("goodsMovement"),
				sUsername = this.getModel("user").getProperty("/USERLOGIN"),
				sDefaultMoveType = "101",
				sDefaultUnitOfMeasure = "KG",

				oParam;

			if (oDataModel.getProperty(sPath + "LENUM")) {
				oParam = {
					"Param.1": oDataModel.getProperty(sPath + "LENUM"),
					"Param.2": oDataModel.getProperty(sPath + "AUFNR"),
					"Param.4": oDataModel.getProperty(sPath + "SOLLME"),
					"Param.5": oDataModel.getProperty(sPath + "MEINH") || sDefaultUnitOfMeasure,
					"Param.6": oDataModel.getProperty(sPath + "MATNR"),
					"Param.10": sUsername,
					"Param.11": oDataModel.getProperty(sPath + "BWART") || sDefaultMoveType
				};
			} else {
				oParam = {
					"Param.2": oDataModel.getProperty(sPath + "AUFNR"),
					"Param.3": oDataModel.getProperty(sPath + "LGORT"),
					"Param.4": oDataModel.getProperty(sPath + "SOLLME"),
					"Param.5": oDataModel.getProperty(sPath + "MEINH") || sDefaultUnitOfMeasure,
					"Param.6": oDataModel.getProperty(sPath + "MATNR"),
					"Param.10": sUsername,
					"Param.11": oDataModel.getProperty(sPath + "BWART") || sDefaultMoveType
				};
			}

			return oGoodsReceiptModel.loadMiiData(oGoodsReceiptModel._sServiceUrl, oParam);

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

		_getIdByInputType: function(oInputType) {
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

		isInputDataValid: function(oData) {
			var fEmpty = 0;

			return !!oData.AUFNR && !!oData.SOLLME && oData.SOLLME > fEmpty && oData.SOLLME !== "" && !!oData.MEINH && !!oData.LGORT && ((!!
				oData.LENUM && oData.LGORT === this._sStorageLocationWarehouse) || (!oData.LENUM && oData.LGORT !== this._sStorageLocationWarehouse));
		},

		onStorageUnitNumberChange: function(oEvent) {
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

			/* Prepare success callback */
			fnResolve = function(oData) {
				var oStorageUnit = {
						LENUM: null
					},
					aRows,
					bStorageUnitValid = true,
					oDataModel = this.getModel("data"),
					iExactlyOne = 1,
					fEmpty = 0;

				try {
					aRows = oData.d.results[0].Rowset.results[0].Row.results;
				} catch (oError) {
					aRows = [];
				}

				/* Check if oData contains required results: extract value, evaluate value, set UI, set model data */
				if (aRows.length === iExactlyOne) {
					oStorageUnit = this._formatStorageUnitData(aRows[0]);

					oSource.setValueState(sap.ui.core.ValueState.Success);

					if (oStorageUnit.SOLLME <= fEmpty) {
						this.addUserMessage({
							text: this.getTranslation("goodsReceipt.messageText.storageUnitAlreadyPosted", [sStorageUnitNumber])
						});
						oSource.setValueState(sap.ui.core.ValueState.Error);
						bStorageUnitValid = false;
					}
				} else {
					this.addUserMessage({
						text: this.getTranslation("goodsReceipt.messageText.storageUnitNotFound", [sStorageUnitNumber])
					});
					oSource.setValueState(sap.ui.core.ValueState.Error);
					bStorageUnitValid = false;
				}

				this.getModel("view").setProperty("/bStorageUnitValid", bStorageUnitValid);

				oDataModel.setData(oStorageUnit);

			}.bind(this);

			/* Prepare error callback */
			fnReject = function(oError) {
				this.addUserMessage({
					text: this.getTranslation("error.miiTransactionErrorText", ["StorageUnitNumberRead"])
				});
				this.addUserMessage({
					text: oError.responseText || oError.message
				}, true);
				oSource.setValueState(sap.ui.core.ValueState.Error).setValue("");
				this.getModel("view").setProperty("/bStorageUnitValid", false);
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

		onOrderNumberChange: function(oEvent) {
			var oSource = oEvent.getSource(),
				sOrderNumber = oEvent.getParameter("value"),
				fnResolve,
				fnReject;

			/* check if current input is valid */
			if (this.controlHasValidationError(oSource)) {
				return;
			}

			/* Prepare UI */
			this.showControlBusyIndicator(oSource);
			oSource.setValueState(sap.ui.core.ValueState.None);

			/* Prepare Data */
			// Order number could come like 1234567/0012 or 000001234567/001 -> need to clean it
			sOrderNumber = this.cleanScannedOrderNumberString(sOrderNumber);

			/* Prepare success callback */
			fnResolve = function(oData) {
				var oOrder,
					aRows,
					bOrderNumberValid = true,
					oDataModel = this.getModel("data"),
					iExactlyOne = 1;

				try {
					aRows = oData.d.results[0].Rowset.results[0].Row.results;
				} catch (oError) {
					aRows = [];
				}

				/* Check if oData contains required results: extract value, evaluate value, set UI, set model data */
				if (aRows.length === iExactlyOne) {
					oOrder = aRows[0];
					oSource.setValueState(sap.ui.core.ValueState.Success);
					oDataModel.setProperty("/AUFNR", oOrder.AUFNR);
				} else {
					this.addUserMessage({
						text: this.getTranslation("goodsReceipt.messageText.orderNumberNotFound", [sOrderNumber])
					});
					oSource.setValueState(sap.ui.core.ValueState.Error);
					bOrderNumberValid = false;
				}

				this.getModel("view").setProperty("/bOrderNumberValid", bOrderNumberValid);

			}.bind(this);

			/* Prepare error callback */
			fnReject = function(oError) {
				this.addUserMessage({
					text: this.getTranslation("error.miiTransactionErrorText", ["OrderHeaderNumberRead"])
				});
				this.addUserMessage({
					text: oError.responseText || oError.message
				}, true);
				oSource.setValueState(sap.ui.core.ValueState.Error).setValue("");
				this.getModel("view").setProperty("/bStorageUnitValid", false);
			}.bind(this);

			/* Perform service call, Hide Busy Indicator, Update View Controls */
			this.requestOrderHeaderInfoService(sOrderNumber)
				.then(fnResolve, fnReject)
				.then(function() {
					this.hideControlBusyIndicator(oSource);
				}.bind(this))
				.then(function() {
					this.updateViewControls(this.getModel("data").getData());
				}.bind(this));
		},

		onQuantityChange: function(oEvent) {
			this.updateViewControls(this.getModel("data").getData());
		},

		onUnitOfMeasureChange: function(oEvent) {
			this.updateViewControls(this.getModel("data").getData());
		},

		onStorageLocationChange: function(oEvent) {
			var sStorageLocation = oEvent.getParameter("value"),
				oDataModel = this.getModel("data");

			// check if storage location is allowed
			if (!this.isStorageLocationAllowed(sStorageLocation)) {
				//oEvent.getSource().setValue("");
				MessageBox.error(this.getTranslation("goodsReceipt.messageText.wrongStorageLocation", [sStorageLocation]));
			}

			// propose default unit of measure if storage location is not 1000 and uom was not entered before 
			// clear unit of measure if storage location is 1000 -> we will get uom from storage unit
			if (sStorageLocation !== this._sStorageLocationWarehouse && !oDataModel.getProperty("/MEINH")) {
				oDataModel.setProperty("/MEINH", this._sDefaultUnitOfMeasure);
			} else if (sStorageLocation === this._sStorageLocationWarehouse) {
				oDataModel.setProperty("/MEINH", null);
			}

			this.updateViewControls(this.getModel("data").getData());
		}

	});
});