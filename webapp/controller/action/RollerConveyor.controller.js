sap.ui.define([
	"./ActionBaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"com/mii/scanner/model/sapType",
	"com/mii/scanner/model/formatter"
], function(ActionBaseController, JSONModel, MessageBox, sapType, formatter) {
	"use strict";

	return ActionBaseController.extend("com.mii.scanner.controller.action.RollerConveyor", {

		sapType: sapType,
		formatter: formatter,

		lastStorageUnit: 90000000000000000000,

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
				
			if(this._isLastStorageUnit(sStorageUnitNumber)){
				oSource.setValueState(sap.ui.core.ValueState.Success);
				return true;
			}

			sStorageUnitNumber = this._padStorageUnitNumber(sStorageUnitNumber);

			oSource.setValueState(sap.ui.core.ValueState.None);

			this.showControlBusyIndicator(oSource);

			this.clearLogMessages();

			var fnResolve = function(oData) {
				var oStorageUnit,
					aResultList,
					bStorageUnitValid;

				try {

					aResultList = oData.d.results[0].Rowset.results[0].Row.results;

					if (aResultList.length === 1) {
						oStorageUnit = this._formatStorageUnitData(oData.d.results[0].Rowset.results[0].Row.results[0]);
						oSource.setValueState(sap.ui.core.ValueState.Success);
						bStorageUnitValid = true;
					} else {
						this.addLogMessage({
							text: oBundle.getText("rollerConveyor.messageText.storageUnitNotFound", [sStorageUnitNumber])
						});
						oSource.setValueState(sap.ui.core.ValueState.Error);
						bStorageUnitValid = false;
					}

					/*
										if (oStorageUnit.ISTME <= 0.001) {
											this.addLogMessage({
												text: oBundle.getText("rollerConveyor.messageText.storageUnitEmpty", [sStorageUnitNumber])
											});
											oSource.setValueState(sap.ui.core.ValueState.Error);
											bStorageUnitValid = false;
										} else {
											bStorageUnitValid = true;
										}
					*/

					this.getModel("data").setData(oStorageUnit, true);

				} catch (err) {
					MessageBox.error(oBundle.getText("rollerConveyor.errorMessageText.storageUnit"), {
						title: err
					});
					oSource.setValueState(sap.ui.core.ValueState.Error);
					bStorageUnitValid = false;
				} finally {
					this.getModel("view").setProperty("/bStorageUnitValid", bStorageUnitValid);
					this.updateViewControls(this.getModel("data").getData());
				}

			}.bind(this);

			var fnReject = function(oError) {
				MessageBox.error(oBundle.getText("rollerConveyor.storageUnit.errorMessageText"));
			}.bind(this);

			this.requestStorageUnitInfoService(sStorageUnitNumber)
				.then(fnResolve, fnReject)
				.then(function() {
					this.hideControlBusyIndicator(oSource);
				}.bind(this));
		},

		onQuantityChange: function(oEvent) {
			this.updateViewControls(this.getModel("data").getData());
		},

		onStorageBinSelectionChange: function(oEvent) {
			this.updateViewControls(this.getModel("data").getData());
		},

		updateViewControls: function(oData) {
			var oViewModel = this.getModel("view"),
				bStorageUnitValid = oViewModel.getProperty("/bStorageUnitValid"),
				bInputValuesComplete,
				bNoErrorMessagesActive,
				bReadyForPosting;

			// check if all required input data is present
			bInputValuesComplete = this.isInputDataValid(oData);

			// check if all input data has proper format
			bNoErrorMessagesActive = this.isMessageModelClean();

			// we are ready for posting once we have complete and proper formatted input
			bReadyForPosting = bNoErrorMessagesActive && bInputValuesComplete && bStorageUnitValid;

			oViewModel.setProperty("/bValid", bReadyForPosting);
		},

		isInputDataValid: function(oData) {
			return !!oData.LENUM && !!oData.storageUnitNumber && !!oData.storageBin && !!oData.storageBinItem && oData.entryQuantity > 0 && oData.entryQuantity !== "" && !!oData.MEINH;
		},
		
		/**
		 * Checks if a storage unit number is the last unit
		 * 
		 * @param {string|number} vStorageUnitNumber storage unit to test for
		 * 
		 * @return {boolean} true if is last, false if not last unit
		 */
		_isLastStorageUnit:function(vStorageUnitNumber){
			return 	this.lastStorageUnit === parseInt(vStorageUnitNumber, 10);
		},

		/**
		 * Creates a new storage unit aka. palette
		 * - Calls /XMII/Runner?Transaction=SUMISA/Scanner/Rollenbahn/trx_NeuePalette
		 * - Sends the storage unit number, storage bin, stretch program
		 * - Sends teh LETZTE_LE falge if storage bin is "02" or "04"
		 * 
		 * @param {string|number} sStorageUnitNumber storage unit number to be created in MII
		 * @param {string} sStorageBin storage bin to where storage unit will be stored
		 * @param {string} sStretchProgram used stretch program
		 */
		_createNewStorageUnit: function(sStorageUnitNumber, sStorageBin, sStretchProgram) {

		}
	});

});