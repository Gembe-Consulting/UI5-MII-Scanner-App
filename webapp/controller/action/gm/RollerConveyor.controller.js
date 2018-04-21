sap.ui.define([
	"./BaseGMController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/core/message/Message",
	"com/mii/scanner/model/sapType",
	"com/mii/scanner/model/formatter"
], function(BaseGMController, JSONModel, MessageBox, Message, sapType, formatter) {
	"use strict";

	return BaseGMController.extend("com.mii.scanner.controller.action.gm.RollerConveyor", {

		sapType: sapType,
		formatter: formatter,

		_aWarningLikeFatalError: ["EZMII_MESSAGES030:", "EZMII_MESSAGES031:", "EZMII_MESSAGES032:", "EZMII_MESSAGES033:", "EZMII_MESSAGES034:"],

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
			stretcherActive: true,
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
			BaseGMController.prototype.onInit.call(this);

			this.setModel(new JSONModel(jQuery.extend({}, this._oInitData)), "data");

			this.setModel(new JSONModel(jQuery.extend({}, this._oInitView)), "view");
		},

		/*
		 *	if(lgplatz == "02")
		 *		queryString += "&ARBID=00248110";	//BEUM
		 *	if(lgplatz == "04")
		 *		queryString += "&ARBID=00253110";	//PALE
		 */
		onSave: function(oEvent) {
			var oDataModel = this.getModel("data"),
				oData = oDataModel.getData(),
				oBundle = this.getResourceBundle(),
				doPosting, //Promise
				fnSuccess,
				fnError,
				that = this;

			this.getOwnerComponent().showBusyIndicator();

			//prepare some control data
			oData.bIsLastUnit = this.formatter.isLastStorageUnit(oDataModel.getProperty("/storageUnit"));
			oData.bIsEmptyUnit = this.formatter.isEmptyStorageUnit(oDataModel.getProperty("/ISTME"));

			// Entweder ist die Palette die "letzte Palette" mit Dummy-LE, dann ist sie immer leer. Der PA muss gefunden werden, und der Speziel-WE mit BwA 555 muss gebucht werden
			// Oder es ist nicht die letzte Palette, also mit einer echten LE, dann ist sie entwerder leer oder bereits voll.
			// Ist die LE leer, muss zunächst der Wareneingang mit BwA 101 gebucht werden, danach erfolgt die Umbuchung auf die Rollenbahn.
			// Ist die LE voll, muss nur die Umbuchung auf die Rollenbahn erfolgen.
			if (oData.bIsLastUnit) { // considering bIsEmptyUnit is always true if bIsLastUnit is true
				this.addMessageManagerMessage("Letzte Palette");

				doPosting = this._findRunningProcessOrder(oData) // PA Findung
					.then(this._createGoodsReceiptRollerConveyor.bind(this)); //Speziel-WE mit BwA 555

			} else if (oData.bIsEmptyUnit) {
				this.addMessageManagerMessage("Laufende Palette mit WE");

				doPosting = this._createGoodsReceipt(oData); //Normal-WE mit BwA 101

			} else {
				this.addMessageManagerMessage("Laufende Palette ohne WE");

				doPosting = Promise.resolve(oData);

			}

			// function to call on success of createStockTransfer
			fnSuccess = function(oFinalData) {
				that.addUserMessage({
					text: that._buildSuccessMessage(oFinalData),
					type: sap.ui.core.MessageType.Success
				}, true /* keep existing */ );
			};

			// function to call on error of createStockTransfer or on any pre-chained promise
			fnError = function(oError) {
				MessageBox.error(oError.message, {
					title: oError.name + oBundle.getText("error.miiTransactionErrorText", [oError.serviceName])
				});
				that.addUserMessage({
					text: oError.message
				});
			};

			doPosting.then(this._createStockTransfer.bind(this)) // Umbuchung auf Rollenbahn
				.then(fnSuccess, fnError) // log success messages OR catch all errers that might occur during postings
				.then(this.getOwnerComponent().hideBusyIndicator)
				.then(function() {
					that.onClearFormPress({}, true /*bKeepMessageStrip*/ );
				});
		},

		/**
		 * creates a goods receipt by sending goods movement to ERP
		 * 
		 * sBwA controls what service is called: 
		 * - Calls on sBwA 101 => SUMISA/Production/trx_GoodsMovementToSap
		 * - Sends in case 101: BWART, AUFNR, LENUM, MENGE, MEINS, UNAME
		 * 
		 * Example: SUMISA/Production/trx_GoodsMovementToSap&BWART=101&AUFNR=1093338&LENUM=00000000109333800001&MENGE=1000&MEINS=KG&UNAME=PHIGEM
		 * 
		 * @param oData {object} data
		 * @return Promise {object} resolved with message {string}
		 */
		_createGoodsReceipt: function(oData) {
			var sendGoodsReceiptPromise,
				sPath = "/",
				oDataModel = this.getModel("data"),
				oGoodsReceiptModel = this.getModel("goodsMovement"),
				sUsername = this.getModel("user").getProperty("/USERLOGIN"),
				sDefaultMoveType = "101",
				sDefaultUnitOfMeasure = "KG",
				oParam,
				fnResolve,
				fnReject;

			this.addMessageManagerMessage("Starte Normal-Wareneingang mit echt BwA 101...");

			oParam = {
				"Param.1": oDataModel.getProperty(sPath + "storageUnit"),
				"Param.2": oDataModel.getProperty(sPath + "orderNumber"),
				"Param.4": oDataModel.getProperty(sPath + "entryQuantity"),
				"Param.5": oDataModel.getProperty(sPath + "unitOfMeasure") || sDefaultUnitOfMeasure,
				"Param.10": sUsername,
				"Param.11": oDataModel.getProperty(sPath + "movementType") || sDefaultMoveType
			};

			sendGoodsReceiptPromise = oGoodsReceiptModel.loadMiiData(oGoodsReceiptModel._sServiceUrl, oParam);

			fnResolve = function(oIllumData) {
				var oRow,
					aRows,
					bHasWarningLikeError;

				if (!oIllumData.success) {
					bHasWarningLikeError = this._aWarningLikeFatalError.some(function(sMessage) {
						return oIllumData.lastErrorMessage.includes(sMessage);
					});

					if (bHasWarningLikeError) {
						this.addUserMessage({
							text: oIllumData.lastErrorMessage.substring(19, oIllumData.lastErrorMessage.length),
							type: sap.ui.core.MessageType.Warning
						});
					} else {
						throw new Error(oIllumData.lastErrorMessage + " @BwA 101");
					}
				}

				aRows = oIllumData.d.results[0].Rowset.results[0].Row.results;

				/* Check if oIllumData contains required results: extract value, evaluate value, set UI, set model data */
				if (aRows.length === 1) {
					oRow = aRows[0];
					oData.storageUnit = oRow.LENUM;
				} else {
					throw new Error("Die Transaktion hat keine LE zurückgegeben.");
				}

				this.addMessageManagerMessage("Wareneingang für Palette " + oRow.LENUM + " erfolgreich.");

				return oData;

			}.bind(this);

			fnReject = function(oError) {
				MessageBox.error(oError.message, {
					title: oError.name
				});
				throw oError; //re-throw
			}.bind(this);

			return sendGoodsReceiptPromise.then(fnResolve, fnReject);
		},

		/**
		 * creates a goods receipt special for roller conveyor by sending goods movement to ERP
		 * 
		 * sBwA controls what service is called:
		 * - Calls on sBwA 555 => SUMISA/Production/trx_GoodsMovementToSAP_Rollenbahn
		 * - Sends in case 555: AUFNR, ARBID, MENGE, MEINS, UNAME
		 * 
		 * Example: SUMISA/Production/trx_GoodsMovementToSAP_Rollenbahn&BWART=555&AUFNR=1093334&ARBID=00253110&MENGE=1001&UNAME=PHIGEM
		 * 
		 * @param oData {object} data
		 * @return Promise {object} resolved with message {string}
		 */
		_createGoodsReceiptRollerConveyor: function(oData) {
			var sendGoodsReceiptRollerConveyorPromise,
				sPath = "/",
				oDataModel = this.getModel("data"),
				oGoodsReceiptRollerConveyorModel = this.getModel("goodsMovementRollerConveyor"),
				sUsername = this.getModel("user").getProperty("/USERLOGIN"),
				oParam,
				fnResolve, fnReject;

			this.addMessageManagerMessage("Starte Spezial-Wareneingang mit pseudo BwA 555...");

			oParam = {
				"Param.1": oDataModel.getProperty(sPath + "orderNumber"),
				"Param.2": oDataModel.getProperty(sPath + "ressourceId"),
				"Param.3": oDataModel.getProperty(sPath + "entryQuantity"),
				"Param.4": sUsername
			};

			fnResolve = function(oIllumData) {
				var oRow,
					aRows,
					bHasWarningLikeError;

				if (!oIllumData.success) {

					bHasWarningLikeError = this._aWarningLikeFatalError.some(function(sMessage) {
						return oIllumData.lastErrorMessage.includes(sMessage);
					});

					if (bHasWarningLikeError) {
						this.addUserMessage({
							text: oIllumData.lastErrorMessage.substring(19, oIllumData.lastErrorMessage.length),
							type: sap.ui.core.MessageType.Warning
						});
					} else {
						throw new Error(oIllumData.lastErrorMessage + " @BwA 555");
					}
				}

				aRows = oIllumData.d.results[0].Rowset.results[0].Row.results;

				/* Check if oData contains required results: extract value, evaluate value, set UI, set model data */
				if (aRows.length === 1) {
					oRow = aRows[0];
					oData.storageUnit = oRow.LENUM;
				} else {
					throw new Error("Die Transaktion hat keine LE zurückgegeben.");
				}

				this.addMessageManagerMessage("Wareneingang für Palette " + oRow.LENUM + " erfolgreich.");

				return oData;

			}.bind(this);

			fnReject = function(oError) {
				MessageBox.error(oError.message, {
					title: oError.name
				});
				throw oError; //re-throw
			}.bind(this);

			sendGoodsReceiptRollerConveyorPromise = oGoodsReceiptRollerConveyorModel.loadMiiData(oGoodsReceiptRollerConveyorModel._sServiceUrl, oParam);

			return sendGoodsReceiptRollerConveyorPromise.then(fnResolve, fnReject);
		},

		/**
		 * Creates a new storage unit aka. palette
		 * - Calls SUMISA/Scanner/Rollenbahn/trx_NeuePalette
		 * - Sends the storage unit number, storage bin, stretch program, IllumLoginName
		 * - Sends the LETZTE_LE flag if storage bin is "BEUM" or "PALE"
		 * 
		 * example for predecessing 101: SUMISA/Scanner/Rollenbahn/trx_NeuePalette&LE=00000000109333800001&Lagerplatz=01&Stretch=1&IllumLoginName=PHIGEM
		 * 
		 * @param {string|number} sStorageUnitNumber storage unit number to be created in MII
		 * @param {string} sStorageBin storage bin to where storage unit will be stored
		 * @param {string} sStretchProgram used stretch program
		 */
		_createStockTransfer: function(oData) {
			var sendStockTransferPromise,
				oStorageUnitCreateModel = this.getModel("storageUnitCreate"),
				oParam,
				fnResolve, fnReject;

			this.addMessageManagerMessage("Starte Umbuchung auf Rollenbahn...");

			oParam = {
				"Param.1": oData.storageBinId, //Lagerplatz (ID),
				"Param.2": oData.stretcherActive ? 1 : 0, //Stretch,
				"Param.3": this.formatter.isLastStorageUnit(oData.storageUnit) ? 1 : 0, //LETZE_LE,
				"Param.4": this.padStorageUnitNumber(oData.storageUnit) //LE
			};

			fnResolve = function(oIllumData) {

				this.addMessageManagerMessage("Umbuchung von Palette " + oData.storageUnit + " auf Lagerplatz " + oData.storageBinId + " erfolgreich.");

				return oData;

			}.bind(this);

			fnReject = function(oError) {
				MessageBox.error(oError.message, {
					title: oError.name
				});
			}.bind(this);

			sendStockTransferPromise = oStorageUnitCreateModel.loadMiiData(oStorageUnitCreateModel._sServiceUrl, oParam);

			return sendStockTransferPromise.then(fnResolve, fnReject);
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
			var findProcessOrderPromise,
				sRessource = this.findRessourceOfStorageBin(oData.storageBin),
				oCurrentProcessOrderModel = this.getModel("currentProcessOrder"),
				oParam,
				fnResolve, fnReject;

			this.addMessageManagerMessage("Starte Prozessauftragsfindung für Aufgabepunkt " + oData.storageBin + " an Ressource " + sRessource + "...");

			oParam = {
				"Param.1": sRessource //ARBID
			};

			fnResolve = function(oIllumData) {
				var oResult = oIllumData.d.results["0"],
					oRow;

				if (oResult.Rowset.results["0"].Row.results.length === 1) {
					oRow = oResult.Rowset.results["0"].Row.results["0"];
					oData.orderNumber = oRow.AUFNR;
					oData.operationNumber = oRow.VORNR;
					oData.ressourceId = oRow.ARBID;

				} else {
					throw new Error("Der aktuell laufende Prozessauftrag auf Ressource " + sRessource + " konnte nicht eindeutig bestimmt werden.");
				}

				this.addMessageManagerMessage("Auf Ressource " + sRessource + " läuft Prozessauftrag " + oRow.AUFNR);

				return oData;

			}.bind(this);

			fnReject = function(oError) {
				MessageBox.error(oError.message, {
					title: oError.name
				});
				throw oError; //re-throw
			}.bind(this);

			findProcessOrderPromise = oCurrentProcessOrderModel.loadMiiData(oCurrentProcessOrderModel._sServiceUrl, oParam);

			return findProcessOrderPromise.then(fnResolve, fnReject);
		},

		setAndRepairDataModel: function(oSource, sStorageUnitNumber) {
			var oDataModel = this.getModel("data"),
				oRessource,
				sStorageBinKey,
				oStorageBinControl,
				oStorageBin,
				oItem;

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

			oRessource = this.getRessourceOfDummyStorageUnit(sStorageUnitNumber);

			sStorageBinKey = oRessource.get("storageBin");

			if (oRessource && sStorageBinKey) {
				oItem = oStorageBinControl.getItemByKey(oRessource.get("storageBin"));
				oStorageBinControl.setSelectedItem(oItem);
				oStorageBinControl.fireSelectionChange({
					selectedItem: oItem
				});
				//oStorageBinControl.setSelectedKey(oRessource.get("storageBin"));
			}

			return true;
		},

		getRessourceOfDummyStorageUnit: function(sStorageUnitNumber) {
			var sRessource,
				oRessource,
				mRessource = new Map();

			// check if valid LE
			if (!sStorageUnitNumber.startsWith("900") && sStorageUnitNumber.length === 20) {
				return mRessource;
			}

			// find ressource id
			sRessource = sStorageUnitNumber.substring(1, 9);

			//check ressource id
			oRessource = this.mapStorageBinToRessource.filter(function(o) {
				return Object.values(o)[0] === sRessource;
			})[0];

			if (!oRessource) {
				return mRessource;
			}

			mRessource.set("ressourceId", Object.values(oRessource)[0]);
			mRessource.set("storageBin", Object.keys(oRessource)[0]);

			return mRessource;
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
			return !!oData.storageUnit && !!oData.storageBin && !!oData.storageBinId && oData.entryQuantity > 0 && oData.entryQuantity !== "" && !!oData.unitOfMeasure;
		},

		findRessourceOfStorageBin: function(sStorageBin) {
			return this.mapStorageBinToRessource.filter(function(o) {
				return !!o[sStorageBin];
			})[0][sStorageBin];
		},

		onStorageUnitInputChange: function(oEvent) {
			var oSource = oEvent.getSource(),
				sStorageUnitNumber = oEvent.getParameter("value"),
				oDataModel = this.getModel("data"),
				oBundle = this.getResourceBundle(),
				fnResolve,
				fnReject;

			/* check if current input is valid */
			if (this.controlHasValidationError(oSource)) {
				return false;
			}

			oSource.setValueState(sap.ui.core.ValueState.None);

			if (!sStorageUnitNumber) {
				return false;
			}

			// on last unit, set dummy storageUnit to hide info fragment and repair storage bin selection
			if (this.formatter.isLastStorageUnit(sStorageUnitNumber)) {

				this.addUserMessage({
					text: oBundle.getText("rollerConveyor.messageText.lastStorageUnit"),
					type: sap.ui.core.MessageType.Information
				});

				return this.setAndRepairDataModel(oSource, sStorageUnitNumber);
			}

			sStorageUnitNumber = this.padStorageUnitNumber(sStorageUnitNumber);
			this.showControlBusyIndicator(oSource);

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
						this.addUserMessage({
							text: oBundle.getText("rollerConveyor.messageText.storageUnitNotFound", [sStorageUnitNumber])
						});
						oSource.setValueState(sap.ui.core.ValueState.Error);
						bStorageUnitValid = false;
					}

					if (bStorageUnitValid) {
						oDataModel.setData(oStorageUnit, true /*bMerge*/ );

						//remap some properties
						oDataModel.setProperty("/unitOfMeasure", oStorageUnit.MEINH);
						oDataModel.setProperty("/orderNumber", oStorageUnit.AUFNR);

						if (!this.formatter.isEmptyStorageUnit(oStorageUnit.ISTME)) {
							oDataModel.setProperty("/entryQuantity", oStorageUnit.ISTME);
						} else {
							oDataModel.setProperty("/entryQuantity", null);
						}
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
			var oSource = oEvent.getSource(),
				oSelectedItem = oSource.getSelectedItem(),
				sStorageBinId = oSelectedItem.data("storageBinId"),
				oDataModel = this.getModel("data");

			oDataModel.setProperty("/storageBinId", sStorageBinId);

			this.updateViewControls(this.getModel("data").getData());
		},

		_buildSuccessMessage: function(oData) {
			var sSuccessMessage,
				sStorageBinItemText = this.byId("storageBinSelection").getSelectedItem().getText(),
				sStorageUnitNumber = this.deleteLeadingZeros(oData.storageUnit);

			if (oData.bIsLastUnit) {
				//Letzte Palette '900248110' erfolgreich von BEUMER an Rollenbahn gemeldet
				sSuccessMessage = this.getTranslation("rollerConveyor.messageText.lastUnitPostingSuccess", [sStorageUnitNumber, sStorageBinItemText]); //"Letzte Palette '" + oData.storageUnit + "' erfolgreich von " + oData.storageBin + " an Rollenbahn gemeldet";
			} else if (oData.bIsEmptyUnit) {
				//Palette '109330000015' erfolgreich eingebucht und von ROLLTOR an Rollenbahn gemeldet
				sSuccessMessage = this.getTranslation("rollerConveyor.messageText.currentUnitWithGoodsReceiptPostingSuccess", [sStorageUnitNumber, sStorageBinItemText]); //"Palette '" + oData.storageUnit + "' erfolgreich eingebucht und von " + oData.storageBin + " an Rollenbahn gemeldet";
			} else {
				//Palette '109330000015' erfolgreich von STAPLER an Rollenbahn gemeldet
				sSuccessMessage = this.getTranslation("rollerConveyor.messageText.currentUnitPostingSuccess", [sStorageUnitNumber, sStorageBinItemText]); //"Palette '" + oData.storageUnit + "' erfolgreich von " + oData.storageBin + " an Rollenbahn gemeldet";
			}

			return sSuccessMessage;
		}
	});

});