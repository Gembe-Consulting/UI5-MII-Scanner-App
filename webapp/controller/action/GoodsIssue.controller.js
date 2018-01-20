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

		checkIfUnplannedComponentWithdrawal: function() {

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

					this.updateViewControls(oDataModel.getData());

				} catch (err) {
					MessageBox.error(oBundle.getText("messageTextStorageUnitNotFound", [sStorageUnitNumber]), {
						title: err
					});
				} finally {}

			}.bind(this);

			var fnReject = function(oError) {
				MessageBox.error(oBundle.getText("messageTextGoodsIssueError"));
			}.bind(this);

			this.requestStorageUnitInfoService(sStorageUnitNumber).then(fnResolve, fnReject);
		},

		onOrderNumberChange: function(oEvent) {
			this.updateViewControls(this.getModel("data").getData());
		},
		onQuantityChange: function(oEvent) {
			this.updateViewControls(this.getModel("data").getData());
		},
		onUnitOfMeasureChange: function(oEvent) {
			this.updateViewControls(this.getModel("data").getData());
		},

		isInputDataValid: function(oData) {
			if (oData) {
				switch (this.getModel("view").getProperty("/type")) {
					case "withLE":
						return !!oData.entryQuantity && !oData.entryQuantity <= 0 && !!oData.unitOfMeasure && !!oData.orderNumber && !!oData.storageUnitNumber && !this.formatter.isPastDate(oData.VFDAT);
						break;
					case "nonLE":
						return !!oData.entryQuantity && !oData.entryQuantity <= 0 && !!oData.unitOfMeasure && !!oData.orderNumber && !!oData.storageLocation && !!oData.materialNumber;
						break;
					default:
						return false;
				}
			} else {
				return false;
			}
		},

	});

});