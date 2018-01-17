sap.ui.define([
	"./ActionBaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"com/mii/scanner/model/sapType"
], function(ActionBaseController, JSONModel, MessageBox, sapType) {
	"use strict";

	return ActionBaseController.extend("com.mii.scanner.controller.action.GoodsIssue", {

		sapType: sapType,

		_aDisallowedStorageLocations: ["VG01", "1000"],

		_oInitData: {
			SOLLME: 0.0,
			MEINH: null,
			AUFNR: null,
			LENUM: null,
			LGORT: null,
			MATNR: null,
			BULK: false
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
					oView.getModel("data").setProperty("/LENUM", oQuery.LENUM);
				}
				if (oQuery.AUFNR) {
					oView.getModel("data").setProperty("/AUFNR", oQuery.AUFNR);
				}
				if (oQuery.MATNR) {
					oView.getModel("data").setProperty("/MATNR", oQuery.MATNR);
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

		onStorageUnitNumberChange: function(oEvent) {
			var sStorageUnitNumber = oEvent.getParameter("value"),
				oBundle = this.getResourceBundle();

			sStorageUnitNumber = this._padStorageUnitNumber(sStorageUnitNumber);

			jQuery.sap.log.info("Start gathering data for palette " + sStorageUnitNumber);

			this.clearLogMessages();

			var fnResolve = function(oData) {
				var oStorageUnit,
					aResultList;

				try {

					aResultList = oData.d.results[0].Rowset.results[0].Row.results;

					if (aResultList.length === 1) {
						oStorageUnit = this._formatStorageUnitData(oData.d.results[0].Rowset.results[0].Row.results[0]);
					} else {
						throw oBundle.getText("messageTitleStorageUnitNotFound");
					}

					if (oStorageUnit.SOLLME <= 0) {
						this.addLogMessage({
							text: oBundle.getText("messageTextStorageUnitIsEmpty", [sStorageUnitNumber])
						});
						this.getModel("view").setProperty("/bStorageUnitValid", false);
					} else {
						this.getModel("view").setProperty("/bStorageUnitValid", true);
					}
					oStorageUnit.AUFNR = null;
					// map data from storage unit to main model
					this.getModel("data").setData(oStorageUnit);

					this.updateViewControls(this.getModel("data").getData());

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
						return !!oData.SOLLME && !!oData.MEINH && !!oData.AUFNR && !!oData.LENUM;
						break;
					case "nonLE":
						return !!oData.SOLLME && !!oData.MEINH && !!oData.AUFNR && !!oData.LGORT && !!oData.MATNR;
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