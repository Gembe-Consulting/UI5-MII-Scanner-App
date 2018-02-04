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
			//uswer input data
			storageUnitNumberInput: null,
			entryQuantity: 0.0,
			targetStorageBinSelection: null,
			//external data
			LENUM: null
		},

		_oInitView: {
			bValid: false,
			storageUnitNumberValueState: sap.ui.core.ValueState.None
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

		onStorageUnitNumberChange: function(oEvent) {
			var oSource = oEvent.getSource(),
				sStorageUnitNumber = oEvent.getParameter("value"),
				oBundle = this.getResourceBundle();

			sStorageUnitNumber = this._padStorageUnitNumber(sStorageUnitNumber);

			oSource.setValueState(sap.ui.core.ValueState.None);

			this.showControlBusyIndicator(oSource);

			this.clearLogMessages();

			var fnResolve = function(oData) {
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

			var fnReject = function(oError) {
				MessageBox.error(oBundle.getText("messageTextStockTransferError"));
			}.bind(this);

			this.requestStorageUnitInfoService(sStorageUnitNumber).then(fnResolve, fnReject).then(function() {
				this.hideControlBusyIndicator(oSource);
			}.bind(this));

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
		 * - Storage bins has been selected
		 * - Storage unit has been entered
		 * - Storage unit is valid
		 * - Quntity has been entered and is not zero
		 */
		isInputDataValid: function(oData) {
			if (oData) {
				return !!oData.targetStorageBinSelection && !!oData.storageUnitNumberInput && !!oData.LENUM && !!oData.entryQuantity && !this.formatter.isEmptyStorageUnit(oData.entryQuantity);
			} else {
				return false;
			}
		},
	});

});