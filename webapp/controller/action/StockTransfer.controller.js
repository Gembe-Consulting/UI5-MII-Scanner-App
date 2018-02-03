sap.ui.define([
	"./ActionBaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"com/mii/scanner/model/sapType"
], function(ActionBaseController, JSONModel, MessageBox, sapType) {
	"use strict";

	return ActionBaseController.extend("com.mii.scanner.controller.action.StockTransfer", {

		sapType: sapType,

		_oInitData: {
			//uswer input data
			storageUnitNumberInput: null,
			quantityInput: 0.0,
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
				var oStorageUnit,
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

					this.getModel("data").setData(oStorageUnit, true);

				} catch (err) {
					MessageBox.error(oBundle.getText("messageTextStockTransferError"));
					oSource.setValueState(sap.ui.core.ValueState.Error);
				} finally {}

			}.bind(this);

			var fnReject = function(oError) {
				MessageBox.error(oBundle.getText("messageTextStockTransferError"));
			}.bind(this);

			this.requestStorageUnitInfoService(sStorageUnitNumber).then(fnResolve, fnReject).then(function() {
				this.hideControlBusyIndicator(oSource);
			}.bind(this));

		}
	});

});