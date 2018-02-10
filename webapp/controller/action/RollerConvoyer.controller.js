sap.ui.define([
	"./ActionBaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"com/mii/scanner/model/sapType",
	"com/mii/scanner/model/formatter"
], function(ActionBaseController, JSONModel, MessageBox, sapType, formatter) {
	"use strict";

	return ActionBaseController.extend("com.mii.scanner.controller.action.RollerConvoyer", {

		sapType: sapType,
		formatter: formatter,

		_oInitData: {
			// entry data
			storageUnitNumber: null,
			entryQuantity: null,
			storageBinItem: null,
			storageBin: null,
			stretcherSwitch: false,
			// external data from storage unit
			LENUM: null,
			MEINH: null
		},

		_oInitView: {
			bValid: false,
			bStorageUnitValid: true,
			storageUnitNumberValueState: sap.ui.core.ValueState.None,
			storageBinValueState: sap.ui.core.ValueState.None
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
			//this.updateViewControls(this.getModel("data").getData());
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
						oStorageUnit = this._formatStorageUnitData(oData.d.results[0].Rowset.results[0].Row.results[0]);
						oSource.setValueState(sap.ui.core.ValueState.Success);
					} else {
						throw oBundle.getText("rollerConvoyer.storageUnit.notFoundMessageText");
					}

					if (oStorageUnit.ISTME <= 0.001) {
						this.addLogMessage({
							text: oBundle.getText("rollerConvoyer.storageUnit.emptyMessageText", [sStorageUnitNumber])
						});
						this.getModel("view")
							.setProperty("/bStorageUnitValid", false);
						oSource.setValueState(sap.ui.core.ValueState.Error);
					} else {
						this.getModel("view")
							.setProperty("/bStorageUnitValid", true);
					}

					this.getModel("data")
						.setData(oStorageUnit, true);

				} catch (err) {
					MessageBox.error(oBundle.getText("messageTextStorageUnitNotFound", [sStorageUnitNumber]), {
						title: err
					});
					oSource.setValueState(sap.ui.core.ValueState.Error);
				} finally {
					this.updateViewControls(this.getModel("data")
						.getData());
				}

			}.bind(this);

			var fnReject = function(oError) {
				MessageBox.error(oBundle.getText("rollerConvoyer.storageUnit.errorMessageText"));
			}.bind(this);

			this.requestStorageUnitInfoService(sStorageUnitNumber)
				.then(fnResolve, fnReject)
				.then(function() {
					this.hideControlBusyIndicator(oSource);
				}.bind(this));
		},

		onQuantityChange: function(oEvent) {
			this.updateViewControls(this.getModel("data")
				.getData());
		},

		onStorageBinSelectionChange: function(oEvent) {
			this.updateViewControls(this.getModel("data")
				.getData());
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

		isInputDataValid: function(oData) {
			if (oData) {
				return !!oData.storageUnit && !!oData.storageBin && oData.entryQuantity > 0 && oData.entryQuantity !== "" && !!oData.unitOfMeasure && !!oData.stretcherSwitch;
			} else {
				return false;
			}
		}
	});

});