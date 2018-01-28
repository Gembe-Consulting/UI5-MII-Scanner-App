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
			entryQuantity: 0.0,
			unitOfMeasure: null,
			orderNumber: null,
			storageUnitNumber: null,
			storageLocation: null,
			materialNumber: null,
			bulkMaterialIndicator: false,
			backflushMaterialIndicator: false,
			//storage unit data
			LENUM: null,
			BESTQ: null,
			VFDAT: null
		},

		onInit: function() {
			var oModel = new JSONModel(),
				oData;

			//jQuery(document).on("scannerDetectionComplete", this.handleBarcodeScanned.bind(this));

			oData = jQuery.extend({}, this._oInitData);
			oModel.setData(oData);
			this.setModel(oModel, "data");

			this._oInitView = {
				bStorageUnitValid: true,
				bValid: false
			};
			this.setModel(new JSONModel(jQuery.extend({}, this._oInitView)), "view");

			this.getRouter().getRoute("goodsIssue").attachMatched(this._onRouteMatched, this);
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
					oView.getModel("data").setProperty("/storageUnitNumber", oQuery.LENUM);
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

			this._postGoodsIssue().then(fnResolve, fnReject);

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

			if (oDataModel.getProperty(sPath + "storageUnitNumber") && oViewModel.getProperty("/type") === "withLE") {
				oParam = {
					"Param.1": oDataModel.getProperty(sPath + "storageUnitNumber"),
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
					//"Param.1": oDataModel.getProperty(sPath + "storageUnitNumber"),
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

		validateComponentWithdrawal: function(sOrderNumber, sMaterialNumber) {
			var oBundle = this.getResourceBundle();

			if (!sOrderNumber || !sMaterialNumber) {
				return null;
			}

			this.clearLogMessages();

			var fnResolve = function(oData) {
				var oOrderComponent,
					aResultList,
					oDataModel = this.getModel("data"),
					sComponentUnitOfMeasure,
					bComponentIsBackflushed = false;

				try {
					aResultList = oData.d.results[0].Rowset.results[0].Row.results;

					if (aResultList.length === 1) {
						oOrderComponent = oData.d.results[0].Rowset.results[0].Row.results[0];
					} else {
						this.addLogMessage({
							text: oBundle.getText("messageTextMaterialNotContaintedInOrderComponentList", [sMaterialNumber, sOrderNumber]),
							type: sap.ui.core.MessageType.Warning
						});
					}

					if (oOrderComponent) {
						if (oOrderComponent.RGEKZ === "X") {
							this.addLogMessage({
								text: oBundle.getText("messageTextMaterialBackflushedInOrderComponentList", [sMaterialNumber])
							});
							bComponentIsBackflushed = true;
						}

						if (!!oDataModel.getProperty("/unitOfMeasure") && (oOrderComponent.EINHEIT !== oDataModel.getProperty("/unitOfMeasure"))) {
							this.addLogMessage({
								text: oBundle.getText("messageTextOrderComponentHasDeviatingUnitOfMeasure", [oOrderComponent.EINHEIT, oDataModel.getProperty("/unitOfMeasure")])
							});
							oDataModel.setProperty("/unitOfMeasure", sComponentUnitOfMeasure);
						}
					}

					oDataModel.setProperty("/backflushMaterialIndicator", bComponentIsBackflushed);

				} catch (err) {
					MessageBox.error(oBundle.getText("messageTextGoodsIssueError"), {
						title: err
					});
				} finally {
					this.updateViewControls(this.getModel("data").getData());
				}
			}.bind(this);

			var fnReject = function(oError) {
				MessageBox.error(oError.message, {
					title: oError.statusText
				});
			}.bind(this);

			this.requestOrderComponentInfoService(sOrderNumber, sMaterialNumber).then(fnResolve, fnReject);
		},

		/*
		 * bestq === "S" || bestq === "Q" || bestq === "R"
		 */
		onStorageUnitNumberChange: function(oEvent) {
			var sStorageUnitNumber = oEvent.getParameter("value"),
				oBundle = this.getResourceBundle();

			sStorageUnitNumber = this._padStorageUnitNumber(sStorageUnitNumber);

			jQuery.sap.log.info("Start gathering data for palette " + sStorageUnitNumber);

			this.clearLogMessages();

			var fnResolve = function(oData) {
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
					} else {
						throw oBundle.getText("messageTitleStorageUnitNotFound");
					}

					if (oStorageUnit.ISTME <= 0) {
						this.addLogMessage({
							text: oBundle.getText("messageTextStorageUnitIsEmpty", [sStorageUnitNumber])
						});
						bStorageUnitDataValid = false;
					}

					if (this.formatter.isPastDate(oStorageUnit.VFDAT)) {
						oExpirationDateFormatted = moment(oStorageUnit.VFDAT, "MM-DD-YYYY");
						this.addLogMessage({
							text: oBundle.getText("messageTextStorageUnitHasPastExpirationDate", [oStorageUnit.CHARG, oExpirationDateFormatted.format("L")])
						});
						bStorageUnitDataValid = false;
					}
					/*
										if (!!oDataModel.getProperty("/unitOfMeasure") && (oStorageUnit.MEINH !== oDataModel.getProperty("/unitOfMeasure"))) {
											this.addLogMessage({
												text: oBundle.getText("messageTextStorageUnitHasDeviatingUnitOfMeasure", [oStorageUnit.MEINH, oDataModel.getProperty("/unitOfMeasure")])
											});
											bStorageUnitDataValid = false;
										}
					*/
					this.getModel("view").setProperty("/bStorageUnitValid", bStorageUnitDataValid);

					// merge data from storage unit with main model
					oDataModel.setData(oStorageUnit, bMergeData);

					// map data from storage unit to main model if neccessary
					oDataModel.setProperty("/storageLocation", oStorageUnit.LGORT);
					oDataModel.setProperty("/unitOfMeasure", oStorageUnit.MEINH);
					oDataModel.setProperty("/materialNumber", oStorageUnit.MATNR);

					// set actual from storage unit as entry quantity, if nothing has been entered yet
					if (oDataModel.getProperty("/entryQuantity") === 0.0) {
						oDataModel.setProperty("/entryQuantity", oStorageUnit.ISTME);
					}

				} catch (err) {
					MessageBox.error(oBundle.getText("messageTextStorageUnitNotFound", [sStorageUnitNumber]), {
						title: err
					});
				} finally {
					this.updateViewControls(oDataModel.getData());
				}

			}.bind(this);

			var fnReject = function(oError) {
				MessageBox.error(oBundle.getText("messageTextGoodsIssueError"));
			}.bind(this);

			this.requestStorageUnitInfoService(sStorageUnitNumber).then(fnResolve, fnReject);
		},

		onOrderNumberChange: function(oEvent) {
			var oSource = oEvent.getSource(),
				sOrderNumber = oEvent.getParameter("value"),
				oBundle = this.getResourceBundle();

			this.clearLogMessages();

			this.showControlBusyIndicator(oSource);

			var fnResolve = function(oData) {
				var aResultList,
					oOrderHeader,
					oModel = this.getModel("data");

				aResultList = oData.d.results[0].Rowset.results[0].Row.results;

				if (aResultList.length === 1) {
					oSource.setValueState(sap.ui.core.ValueState.Success);
					oOrderHeader = oData.d.results[0].Rowset.results[0].Row.results[0];

					this.validateComponentWithdrawal(oModel.getProperty("/orderNumber"), oModel.getProperty("/materialNumber"));

				} else {
					oSource.setValueState(sap.ui.core.ValueState.Error);
					this.addLogMessage({
						text: oBundle.getText("messageTextGoodsIssueOrderNumberNotFoundError", [sOrderNumber])
					});
				}

			}.bind(this);

			var fnReject = function(oError) {
				MessageBox.error(oBundle.getText("messageTextGoodsIssueError"));
			}.bind(this);

			this.requestOrderHeaderInfoService(sOrderNumber).then(fnResolve, fnReject).then(function() {
				this.hideControlBusyIndicator(oSource);
			}.bind(this));

		},

		onQuantityChange: function(oEvent) {
			this.updateViewControls(this.getModel("data").getData());
		},
		onUnitOfMeasureChange: function(oEvent) {
			//this.getModel("data").setProperty("/unitOfMeasure", oEvent.getParameter("value").toUpperCase());
			this.updateViewControls(this.getModel("data").getData());
		},
		onMaterialNumbeChange: function(oEvent) {
			this.validateComponentWithdrawal(oModel.getProperty("/orderNumber"), oModel.getProperty("/materialNumber"));
			this.updateViewControls(this.getModel("data").getData());
		},
		onStorageLocationChange: function(oEvent) {
			//this.getModel("data").setProperty("/storageLocation", oEvent.getParameter("value").toUpperCase());
			this.updateViewControls(this.getModel("data").getData());
		},

		isInputDataValid: function(oData) {
			if (oData) {
				switch (this.getModel("view").getProperty("/type")) {
					case "withLE":
						return !!oData.entryQuantity && !oData.entryQuantity <= 0 && !!oData.unitOfMeasure && !!oData.orderNumber && !!oData.storageUnitNumber && oData.backflushMaterialIndicator === false && !this.formatter.isPastDate(oData.VFDAT);
						break;
					case "nonLE":
						return !!oData.entryQuantity && !oData.entryQuantity <= 0 && !!oData.unitOfMeasure && !!oData.orderNumber && !!oData.storageLocation && !!oData.materialNumber && oData.backflushMaterialIndicator === false;
						break;
					default:
						return false;
				}
			} else {
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