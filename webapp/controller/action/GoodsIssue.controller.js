sap.ui.define([
	"./ActionBaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"com/mii/scanner/model/sapType",
	"com/mii/scanner/model/formatter"
], function(ActionBaseController, JSONModel, MessageBox, sapType, formatter) {
	"use strict";

	return ActionBaseController.extend("com.mii.scanner.controller.action.GoodsIssue", {

		sapType: sapType,
		formatter: formatter,

		_aDisallowedStorageLocations: ["VG01", "1000"],

		_oInitData: {
			//entry screen data
			entryQuantity: null,
			unitOfMeasure: null,
			orderNumber: null,
			storageUnit: null,
			storageLocation: null,
			materialNumber: null,
			bulkMaterialIndicator: false,
			//storage unit data
			LENUM: null,
			MEINH: null,
			BESTQ: null,
			VFDAT: null
		},

		_oInitView: {
			bStorageUnitValid: true,
			bOrderNumberValid: true,
			bValid: false,
			storageUnitValueState: sap.ui.core.ValueState.None,
			orderNumberValueState: sap.ui.core.ValueState.None,
			materialNumberValueState: sap.ui.core.ValueState.None
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

			this.getRouter()
				.getRoute("goodsIssue")
				.attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function(oEvent) {
			var oArgs, oView, oQuery;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();

			oQuery = oArgs["?query"];

			if (oQuery) {
				if (oQuery.type) {
					this._oInitView.type = oQuery.type; //update initial object
					oView.getModel("view").setProperty("/type", oQuery.type);
				}
				if (oQuery.LENUM) {
					oView.getModel("data").setProperty("/storageUnit", oQuery.LENUM);
					this.byId("storageUnitInput").fireChange({
							value: oQuery.LENUM
						});
				}
				if (oQuery.AUFNR) {
					oView.getModel("data").setProperty("/orderNumber", oQuery.AUFNR);
					this.byId("orderNumberInput").fireChange({
							value: oQuery.AUFNR
						});
				}
				if (oQuery.MATNR) {
					oView.getModel("data").setProperty("/materialNumber", oQuery.MATNR);
					this.byId("materialNumberInput").fireChange({
							value: oQuery.MATNR
						});
				}
				if (oQuery.MEINH) {
					oView.getModel("data").setProperty("/unitOfMeasure", oQuery.MEINH);
					this.byId("unitOfMeasureInput").fireChange({
							value: oQuery.MEINH
						});
				}
				if (oQuery.LGORT) {
					oView.getModel("data").setProperty("/storageLocation", oQuery.LGORT);
					this.byId("storageLocationInput").fireChange({
							value: oQuery.LGORT
						});
				}
				if (oQuery.SCHGT) {
					oQuery.SCHGT = (oQuery.SCHGT == 'true');
					oView.getModel("data").setProperty("/bulkMaterialIndicator", oQuery.SCHGT);
					this.byId("bulkMaterialSwitch").fireChange({
							value: oQuery.SCHGT
						});
				}
			}
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
					oReturn,
					oDataModel = this.getModel("data");

				try {

					aResults = oData.d.results[0].Rowset.results;
					aMessages = oData.d.results[0].Messages.results;
					sFatalError = oData.d.results[0].FatalError;

					if (!sFatalError) {
						this.addLogMessage({
							text: oBundle.getText("messageTextGoodsIssuePostingSuccessfull", [oDataModel.getProperty("/orderNumber")]),
							type: sap.ui.core.MessageType.Success
						});
					} else {
						this.addLogMessage({
							text: sFatalError,
							type: sap.ui.core.MessageType.Error
						});
					}

				} catch (err) {
					MessageBox.error(oBundle.getText("messageTextGoodsIssuePostingFailed"), {
						title: err
					});
				} finally {
					this.onClearFormPress({}, true /*bKeepMessageStrip*/ );
				}
			}.bind(this);

			fnReject = function(oError) {
				MessageBox.error(oBundle.getText("messageTextGoodsIssueError"));
			}.bind(this);

			this._postGoodsIssue()
				.then(fnResolve, fnReject)
				.then(this.getOwnerComponent()
					.hideBusyIndicator);

		},

		_postGoodsIssue: function() {

			var sPath = "/",
				oDataModel = this.getModel("data"),
				oViewModel = this.getModel("view"),
				oGoodsIssueModel = this.getModel("goodsMovement"),

				sDefaultPlant = "1000",
				sDefaultMoveType = "261",
				sDefaultUnitOfMeasure = "KG",

				oParam;

			if (oDataModel.getProperty(sPath + "storageUnit") && oViewModel.getProperty("/type") === "withLE") {
				oParam = {
					"Param.1": oDataModel.getProperty(sPath + "storageUnit"),
					"Param.2": oDataModel.getProperty(sPath + "orderNumber"),
					//"Param.3": oDataModel.getProperty(sPath + "storageLocation"),
					"Param.4": oDataModel.getProperty(sPath + "entryQuantity"),
					"Param.5": oDataModel.getProperty(sPath + "unitOfMeasure") || sDefaultUnitOfMeasure,
					"Param.6": oDataModel.getProperty(sPath + "materialNumber"),
					//"Param.7": oDataModel.getProperty(sPath + "batchNumber"),
					//"Param.8": oDataModel.getProperty(sPath + "bulkMaterialIndicator"),
					//"Param.9": oDataModel.getProperty(sPath + "operationNumber"),
					"Param.11": oDataModel.getProperty(sPath + "movementType") || sDefaultMoveType,
					//"Param.12": oDataModel.getProperty(sPath + "plant") || sDefaultPlant,
					//"Param.13": oDataModel.getProperty(sPath + "LGTYP"),
					//"Param.14": oDataModel.getProperty(sPath + "LGPLA"),
					//"Param.15": oDataModel.getProperty(sPath + "NLTYP"),
					//"Param.16": oDataModel.getProperty(sPath + "NLPLA")
				};
			} else {
				oParam = {
					//"Param.1": oDataModel.getProperty(sPath + "storageUnit"),
					"Param.2": oDataModel.getProperty(sPath + "orderNumber"),
					"Param.3": oDataModel.getProperty(sPath + "storageLocation"),
					"Param.4": oDataModel.getProperty(sPath + "entryQuantity"),
					"Param.5": oDataModel.getProperty(sPath + "unitOfMeasure") || sDefaultUnitOfMeasure,
					"Param.6": oDataModel.getProperty(sPath + "materialNumber"),
					//"Param.7": oDataModel.getProperty(sPath + "batchNumber"),
					//"Param.8": oDataModel.getProperty(sPath + "bulkMaterialIndicator"),
					//"Param.9": oDataModel.getProperty(sPath + "operationNumber"),
					"Param.11": oDataModel.getProperty(sPath + "movementType") || sDefaultMoveType,
					//"Param.12": oDataModel.getProperty(sPath + "plant") || sDefaultPlant,
					//"Param.13": oDataModel.getProperty(sPath + "LGTYP"),
					//"Param.14": oDataModel.getProperty(sPath + "LGPLA"),
					//"Param.15": oDataModel.getProperty(sPath + "NLTYP"),
					//"Param.16": oDataModel.getProperty(sPath + "NLPLA")
				};
			}

			return oGoodsIssueModel.loadMiiData(oGoodsIssueModel._sServiceUrl, oParam);

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

		validateComponentWithdrawal: function(sOrderNumber, sMaterialNumber, oSource) {
			var oBundle = this.getResourceBundle(),
				fnReject,
				fnResolve;

			if (!sOrderNumber || !sMaterialNumber) {
				return false;
			}

			this.showControlBusyIndicator(oSource);
			oSource.setValueState(sap.ui.core.ValueState.None);

			this.clearLogMessages();

			fnResolve = function(oData) {
				var oOrderComponent,
					aResultList,
					oDataModel = this.getModel("data"),
					sComponentUnitOfMeasure;

				try {
					aResultList = oData.d.results[0].Rowset.results[0].Row.results;

					if (aResultList.length === 1) {
						oOrderComponent = oData.d.results[0].Rowset.results[0].Row.results[0];
						oSource.setValueState(sap.ui.core.ValueState.Success);
					} else {
						this.addLogMessage({
							text: oBundle.getText("messageTextMaterialNotContaintedInOrderComponentList", [sMaterialNumber, sOrderNumber]),
							type: sap.ui.core.MessageType.Warning
						});
						oSource.setValueState(sap.ui.core.ValueState.Warning);
					}

					if (oOrderComponent) {
						if (oOrderComponent.RGEKZ === "X") {
							oSource.setValueState(sap.ui.core.ValueState.Warning);
							this.addLogMessage({
								text: oBundle.getText("messageTextMaterialBackflushedInOrderComponentList", [sMaterialNumber]),
								type: sap.ui.core.MessageType.Warning
							});
						}

						if (oDataModel.getProperty("/unitOfMeasure") && oDataModel.getProperty("/unitOfMeasure") !== oOrderComponent.EINHEIT) {
							this.addLogMessage({
								text: oBundle.getText("messageTextOrderComponentHasDeviatingUnitOfMeasure", [oOrderComponent.EINHEIT, oDataModel.getProperty("/unitOfMeasure")])
							});
							oSource.setValueState(sap.ui.core.ValueState.Error);
						} else {
							sComponentUnitOfMeasure = oOrderComponent.EINHEIT;
						}

						oDataModel.setProperty("/unitOfMeasure", sComponentUnitOfMeasure);

						// update entry quantity by remaining open quantity, but only if users did not enter a quantity beforhand
						if (this.getModel("view").getProperty("/type") === "nonLE" && (!oDataModel.getProperty("/entryQuantity") || oDataModel.getProperty("/entryQuantity") === "")) {
							oDataModel.setProperty("/entryQuantity", oOrderComponent.BDMNG - oOrderComponent.ENMNG);
							oSource.setTooltip("Restmenge \'" + (oOrderComponent.BDMNG - oOrderComponent.ENMNG) + "\' = Bedarfsmenge \'" + oOrderComponent.BDMNG + "\' - Entnommene Menge \'" + oOrderComponent.ENMNG + "\'");
						}

					}

				} catch (err) {
					MessageBox.error(oBundle.getText("messageTextGoodsIssueError"), {
						title: err
					});
				} finally {
					this.updateViewControls(this.getModel("data").getData());
				}
			}.bind(this);

			fnReject = function(oError) {
				MessageBox.error(oError.message, {
					title: oError.statusText
				});
			}.bind(this);

			this.requestOrderComponentInfoService(sOrderNumber, sMaterialNumber)
				.then(fnResolve, fnReject)
				.then(function() {
					this.hideControlBusyIndicator(oSource);
				}.bind(this));

			return true;
		},

		/*
		 * bestq === "S" || bestq === "Q" || bestq === "R"
		 */
		onStorageUnitInputChange: function(oEvent) {
			var oSource = oEvent.getSource(),
				sStorageUnit = oEvent.getParameter("value"),
				oBundle = this.getResourceBundle(),
				fnResolve,
				fnReject;

			sStorageUnit = this._padStorageUnitNumber(sStorageUnit);

			jQuery.sap.log.info("Start gathering data for palette " + sStorageUnit);

			oSource.setValueState(sap.ui.core.ValueState.None);
			this.showControlBusyIndicator(oSource);

			this.clearLogMessages();

			fnResolve = function(oData) {
				var oStorageUnit,
					aResultList,
					bStorageUnitDataValid = true,
					bMergeData = true,
					oExpirationDateFormatted,
					oDataModel = this.getModel("data");

				try {

					aResultList = oData.d.results[0].Rowset.results[0].Row.results;

					if (aResultList.length === 1) {
						oStorageUnit = this._formatStorageUnitData(oData.d.results[0].Rowset.results[0].Row.results[0]);
						oSource.setValueState(sap.ui.core.ValueState.Success);
					} else {
						throw oBundle.getText("messageTitleStorageUnitNotFound");
					}

					if (oStorageUnit.ISTME <= 0) {
						oSource.setValueState(sap.ui.core.ValueState.Error);
						this.addLogMessage({
							text: oBundle.getText("messageTextStorageUnitIsEmpty", [sStorageUnit])
						});
						bStorageUnitDataValid = false;
					}

					if (this.formatter.isPastDate(oStorageUnit.VFDAT)) {
						oSource.setValueState(sap.ui.core.ValueState.Warning);
						oExpirationDateFormatted = moment(oStorageUnit.VFDAT, "MM-DD-YYYY");
						this.addLogMessage({
							text: oBundle.getText("messageTextStorageUnitHasPastExpirationDate", [oStorageUnit.CHARG, oExpirationDateFormatted.format("L")]),
							type: sap.ui.core.MessageType.Warning
						});
					}

					// merge data from storage unit with main model
					oDataModel.setData(oStorageUnit, bMergeData);

					// map data from storage unit to main model if neccessary
					oDataModel.setProperty("/storageUnit", oStorageUnit.LENUM);
					oDataModel.setProperty("/storageLocation", oStorageUnit.LGORT);
					oDataModel.setProperty("/unitOfMeasure", oStorageUnit.MEINH);
					oDataModel.setProperty("/materialNumber", oStorageUnit.MATNR);

					// set actual from storage unit as entry quantity, if nothing has been entered yet
					if (!oDataModel.getProperty("/entryQuantity") || oDataModel.getProperty("/entryQuantity") === "") {
						oDataModel.setProperty("/entryQuantity", oStorageUnit.ISTME);
					}

				} catch (err) {
					MessageBox.error(oBundle.getText("messageTextStorageUnitNotFound", [sStorageUnit]), {
						title: err
					});
					bStorageUnitDataValid = false;
				} finally {
					this.getModel("view").setProperty("/bStorageUnitValid", bStorageUnitDataValid);
					this.updateViewControls(oDataModel.getData());
				}

			}.bind(this);

			fnReject = function(oError) {
				MessageBox.error(oBundle.getText("messageTextGoodsIssueError"));
			}.bind(this);

			this.requestStorageUnitInfoService(sStorageUnit)
				.then(fnResolve, fnReject)
				.then(function() {
					this.hideControlBusyIndicator(oSource);
				}.bind(this));
		},

		onOrderNumberInputChange: function(oEvent) {
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
					oOrderHeader,
					oModel = this.getModel("data");

				aResultList = oData.d.results[0].Rowset.results[0].Row.results;

				if (aResultList.length === 1) {
					oSource.setValueState(sap.ui.core.ValueState.Success);
					this.getModel("view").setProperty("/bOrderNumberValid", true);
					
					oOrderHeader = oData.d.results[0].Rowset.results[0].Row.results[0];

					this.validateComponentWithdrawal(oModel.getProperty("/orderNumber"), oModel.getProperty("/materialNumber"), oSource);

				} else {
					oSource.setValueState(sap.ui.core.ValueState.Error);
					this.getModel("view").setProperty("/bOrderNumberValid", false);
					
					this.addLogMessage({
						text: oBundle.getText("messageTextGoodsIssueOrderNumberNotFoundError", [sOrderNumber])
					});
					
					this.updateViewControls(this.getModel("data").getData());
				}

			}.bind(this);

			fnReject = function(oError) {
				MessageBox.error(oBundle.getText("messageTextGoodsIssueError"));
			}.bind(this);

			this.requestOrderHeaderInfoService(sOrderNumber)
				.then(fnResolve, fnReject)
				.then(function() {
					this.hideControlBusyIndicator(oSource);
				}.bind(this));

		},

		onQuantityInputChange: function(oEvent) {
			this.updateViewControls(this.getModel("data").getData());
		},

		onUnitOfMeasureInputChange: function(oEvent) {
			var sUnitOfMeasure = oEvent.getParameter("value")
				.toUpperCase(),
				oSource = oEvent.getSource(),
				oDataModel = this.getModel("data");

			oDataModel.setProperty("/unitOfMeasure", sUnitOfMeasure);

			this.validateComponentWithdrawal(oDataModel.getProperty("/orderNumber"), oDataModel.getProperty("/materialNumber"), oSource);

		},

		onMaterialNumberInputChange: function(oEvent) {
			var oModel = this.getModel("data"),
				oSource = oEvent.getSource();

			this.validateComponentWithdrawal(oModel.getProperty("/orderNumber"), oModel.getProperty("/materialNumber"), oSource);
		},

		onStorageLocationInputChange: function(oEvent) {
			var sStorageLocation = oEvent.getParameter("value")
				.toUpperCase(),
				oBundle = this.getResourceBundle(),
				oDataModel = this.getModel("data");

			if (!this.isStorageLocationAllowed(sStorageLocation)) {
				MessageBox.error(oBundle.getText("messageTextWrongStorageLocation", [sStorageLocation]));
			} else {
				oDataModel.setProperty("/storageLocation", sStorageLocation);
			}

			this.updateViewControls(this.getModel("data").getData());
		},

		isInputDataValid: function(oData) {
			switch (this.getModel("view").getProperty("/type")) {
				case "withLE":
					return !!oData.entryQuantity && oData.entryQuantity > 0 && oData.entryQuantity !== "" && !!oData.unitOfMeasure && !!oData.orderNumber && !!oData.storageUnit;
				case "nonLE":
					return !!oData.entryQuantity && oData.entryQuantity > 0 && oData.entryQuantity !== "" && !!oData.unitOfMeasure && !!oData.orderNumber && !!oData.storageLocation && !!oData.materialNumber;
				default:
					return false;
			}
		},

		setPageTitle: function(sType) {
			var oBundle = this.getResourceBundle(),
				sTitleText = "titleGoodsIssue";

			return oBundle.getText(sTitleText + (sType || ""));
		}

	});

});