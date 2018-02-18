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

		mapStorageBinToRessource: [{
			BEUM: "00248110"
		}, {
			PALE: "00253110"
		}],

		_oInitData: {
			// entry data
			storageUnit: null,
			entryQuantity: null,
			unitOfMeasure: null,
			storageBin: null,
			stretcherActive: false,
			// external data from storage unit
			LENUM: null,
			MEINH: null,
			ISTME: null
		},

		_oInitView: {
			bValid: false,
			bStorageUnitValid: true,
			storageUnitValueState: sap.ui.core.ValueState.None,
			storageBinValueState: sap.ui.core.ValueState.None
		},

		onInit: function() {
			//call super class onInit to apply user login protection. DO NOT DELETE!
			ActionBaseController.prototype.onInit.call(this);

			//jQuery(document).on("scannerDetectionComplete", this.handleBarcodeScanned.bind(this));

			this.setModel(new JSONModel(jQuery.extend({}, this._oInitData)), "data");

			this.setModel(new JSONModel(jQuery.extend({}, this._oInitView)), "view");
		},

		/*
					if(lgplatz == "02")
						queryString += "&ARBID=00248110";//BEUM
					else 
						queryString += "&ARBID=00253110";//PALE
		*/

		onSave: function(oEvent) {
			var sMessageString,
				oDataModel = this.getModel("data"),
				oData = oDataModel.getData(),
				bIsLastUnit = this.formatter.isLastStorageUnit(oDataModel.getProperty("/storageUnit")),
				bIsEmptyUnit = this.formatter.isEmptyStorageUnit(oDataModel.getProperty("/ISTME")),
				doPosting,
				that = this;
				
			// prepare messages array
			oData.messages = [];

			if (bIsLastUnit) { // considering bIsEmptyUnit is always true if bIsLastUnit is true
				oData.messages.push("Letzte Palette");
				oDataModel.setProperty("/movementType", 555);
				
				doPosting = this._findRunningProcessOrder(oData)
								.then(this._createGoodsReceipt);	//555

			} else if (bIsEmptyUnit) {
				oData.messages.push("Laufende Palette");
				oDataModel.setProperty("/movementType", 101);
				
				doPosting = this._createGoodsReceipt(oData);		//101
				
			}else{
				oData.messages.push("Laufende Palette");
				doPosting = Promise.resolve(oData);
			}
			
			doPosting.then(this._createStockTransfer)
					.then(function(oData){
						that.addLogMessage({
							text: oData.messages.join(" - "),
							type: sap.ui.core.MessageType.Success
					});
			});
			

		},

		onStorageUnitInputChange: function(oEvent) {
			var oSource = oEvent.getSource(),
				sStorageUnitNumber = oEvent.getParameter("value"),
				oDataModel = this.getModel("data"),
				oBundle = this.getResourceBundle(),
				fnResolve,
				fnReject;

			oSource.setValueState(sap.ui.core.ValueState.None);

			if (!sStorageUnitNumber) {
				return false;
			}

			// on last unit, set dummy storageUnit to hide info fragment and repair storage bin selection
			if (this.formatter.isLastStorageUnit(sStorageUnitNumber)) {

				this.addLogMessage({
					text: oBundle.getText("rollerConveyor.messageText.lastStorageUnit"),
					type: sap.ui.core.MessageType.Information
				});

				return this.setAndRepairDataModel(oSource);
			}

			sStorageUnitNumber = this._padStorageUnitNumber(sStorageUnitNumber);

			this.showControlBusyIndicator(oSource);

			this.clearLogMessages();

			fnResolve = function(oData) {
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

					oDataModel.setData(oStorageUnit, true /*bMerge*/ );

					//remap some properties
					oDataModel.setProperty("/unitOfMeasure", oStorageUnit.MEINH);

					if (!this.formatter.isEmptyStorageUnit(oStorageUnit.ISTME)) {
						oDataModel.setProperty("/entryQuantity", oStorageUnit.ISTME);
					} else {
						oDataModel.setProperty("/entryQuantity", null);
					}

				} catch (err) {
					MessageBox.error(oBundle.getText("rollerConveyor.errorMessageText.storageUnit"), {
						title: err
					});
					oSource.setValueState(sap.ui.core.ValueState.Error);
					bStorageUnitValid = false;
				} finally {
					this.getModel("view").setProperty("/bStorageUnitValid", bStorageUnitValid);
					this.updateViewControls(oDataModel.getData());
				}

			}.bind(this);

			fnReject = function(oError) {
				MessageBox.error(oBundle.getText("rollerConveyor.storageUnit.errorMessageText"));
			}.bind(this);

			this.requestStorageUnitInfoService(sStorageUnitNumber)
				.then(fnResolve, fnReject)
				.then(function() {
					this.hideControlBusyIndicator(oSource);
				}.bind(this));
		},

		setAndRepairDataModel: function(oSource) {
			var oDataModel = this.getModel("data"),
				oStorageBinControl,
				oStorageBin;

			oDataModel.setData({
				entryQuantity: null,
				unitOfMeasure: null,
				LENUM: null,
				MEINH: null,
				ISTME: null
			}, true);

			oSource.setValueState(sap.ui.core.ValueState.Success);

			//reset storage bin, if wrong was selected before
			oStorageBinControl = this.byId("storageBinSelection");
			oStorageBin = oStorageBinControl.getSelectedItem();

			if (oStorageBin && !oStorageBin.getEnabled()) {
				oStorageBinControl.setSelectedItemId(); //clear value
			}

			return true;
		},

		onQuantityInputChange: function(oEvent) {
			this.updateViewControls(this.getModel("data").getData());
		},

		onUnitOfMeasureInputChange: function(oEvent) {
			var sUoM = oEvent.getParameter("value"),
				oDataModel = this.getModel("data");

			oDataModel.setProperty("/unitOfMeasure", sUoM.toUpperCase());

			this.updateViewControls(oDataModel.getData());
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
			return !!oData.storageUnit && !!oData.storageBin && oData.entryQuantity > 0 && oData.entryQuantity !== "" && !!oData.unitOfMeasure;
		},

		findRessourceOfStorageBin: function(sStorageBin) {
			return this.mapStorageBinToRessource.filter(function(o) {
				return !!o[sStorageBin];
			})[0][sStorageBin];
		},
		
		/**
		 * creates a goods receipt by sending goods movement to ERP
		 * 
		 * sBwA controls what service is called:
		 * - Calls on sBwA 101 => SUMISA/Production/trx_GoodsMovementToSap
		 * - Sends in case 101: BWART, AUFNR, ARBID, MENGE, MEINS, UNAME
		 * 
		 * - Calls on sBwA 555 => SUMISA/Production/trx_GoodsMovementToSAP_Rollenbahn
		 * - Sends in case 555: BWART, AUFNR, LENUM, MENGE, MEINS, UNAME
		 * 
		 * @param oData {object} data
		 * @return Promise {object} resolved with message {string}
		 */
		_createGoodsReceipt: function(oData) {
			var sendGoodsReceipt;

			sendGoodsReceipt = new Promise(function(resolve, reject) {
				
				if (oData.movementType === 101) {
					oData.messages.push("Normal-Wareneingang mit echt BwA 101");
				} else {
					oData.messages.push("Spezial-Wareneingang mit pseudo BwA 555");
				}
				
				resolve(oData);
			});

			return sendGoodsReceipt;
		},
		
		/**
		 * Creates a new storage unit aka. palette
		 * - Calls SUMISA/Scanner/Rollenbahn/trx_NeuePalette
		 * - Sends the storage unit number, storage bin, stretch program, IllumLoginName
		 * - Sends the LETZTE_LE flag if storage bin is "BEUM" or "PALE"
		 * 
		 * @param {string|number} sStorageUnitNumber storage unit number to be created in MII
		 * @param {string} sStorageBin storage bin to where storage unit will be stored
		 * @param {string} sStretchProgram used stretch program
		 */
		_createStockTransfer: function(oData) {
			var sendStockTransfer;

			sendStockTransfer = new Promise(function(resolve, reject) {
				oData.messages.push("Spezial-Umbuchung mit pseudo BwA 999")
				resolve(oData);
			});

			return sendStockTransfer;
		},
		
		/**
		 * Resolves the currently running process order by the given storage bin
		 * - Calls SUMISA/Scanner/Rollenbahn/sql_FindCurrentPAByARBID
		 * - Sends Param.1 = sRessource (BEUM: 00248110 | PALE:00253110)
		 * 
		 * @param oData {object} data
		 * @return Promise {object} resolved with sOrderNumber {string}
		 */
		_findRunningProcessOrder: function(oData) {
			var findProcessOrder,
				sRessource = this.findRessourceOfStorageBin(oData.storageBin);

			findProcessOrder = new Promise(function(resolve, reject) {
				if (sRessource === "00253110") {
					oData.AUFNR = "4712";
				} else {
					oData.AUFNR = "4711";
				}
				
				resolve(oData);
			});

			return findProcessOrder;
		}
	});

});