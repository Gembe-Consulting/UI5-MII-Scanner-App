sap.ui.define([
	"com/mii/scanner/controller/PageBaseController",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/m/MessageStrip",
	"com/mii/scanner/model/formatter"
], function(PageBaseController, MessageBox, MessageToast, MessageStrip, formatter) {
	"use strict";

	return PageBaseController.extend("com.mii.scanner.controller.action.ActionBaseController", {
		formatter: formatter,

		aScannerInputTypes: [{
			defaultControlId: "storageUnitInput",
			key: "LENUM",
			name: "Storage Unit",
			validationExpressions: [
				/^10\d{10}/gm,
				/^0{8}10\d{10}/gm,
				/^90025311000000000000/gm,
				/^90024811000000000000/gm
			]
		}, {
			defaultControlId: "storageLocationInput",
			key: "LGORT",
			name: "Storage Location",
			validationExpressions: [/^[a-zA-z0-9]{4}$/gm]

		}, {
			defaultControlId: "storageBinSelection",
			key: "LGPLA",
			name: "Storage Bin",
			validationExpressions: [/^[a-zA-z0-9-]{5,10}$/gm]

		}, {
			defaultControlId: "orderNumberInput",
			key: "AUFNR_VORNR",
			name: "Order Number and Operation",
			validationExpressions: [
				/^0{5}1\d{6}\/\d{4}$/gm,
				/^1\d{6}\/\d{4}$/gm
			]
		}, {
			defaultControlId: "materialNumberInput",
			key: "MATNR",
			name: "Material number",
			validationExpressions: [
				/^\d{7}-\d{3}$/gm
			]
		}, {
			defaultControlId: "usernameInput",
			key: "USERLOGIN",
			name: "Username",
			validationExpressions: [/^[a-zA-z0-9]{6,8}$/gm]

		}],

		onInit: function() {
			PageBaseController.prototype.onInit.call(this);

			this.getView().addEventDelegate({
				"onBeforeShow": function(oEvent) {
					jQuery(document).on("scannerDetectionComplete", this.handleBarcodeScanned.bind(this));
					jQuery.sap.log.info("Event scannerDetectionComplete attached to view: " + this.getView().getViewName(), this.toString(), "ScannerDetection");
				}
			}, this);

			this.getView().addEventDelegate({
				"onBeforeHide": function(oEvent) {
					jQuery(document).off("scannerDetectionComplete");
					jQuery.sap.log.info("Event scannerDetectionComplete detached from view: " + this.getView().getViewName(), this.toString(), "ScannerDetection");
				}
			}, this);
		},

		handleBarcodeScanned: function(oEvent, oData) {
			var sScannedString = oData.string,
				oScannerInputType,
				oControl;

			oScannerInputType = this.getScannerInputType(sScannedString);

			if (oScannerInputType) {
				jQuery.sap.log.info("Barcode enthält folgende Information: \'" + sScannedString + "\' Sie haben \'" + oScannerInputType.name + "\' gescannt.");
				// TODO: remove message box
				MessageBox.success("Barcode enthält folgende Information: \'" + sScannedString + "\' Sie haben \'" + oScannerInputType.name + "\' gescannt.");

				oControl = this.getControlByScannerInputType(oScannerInputType);

				if (oControl) {
					// Maybe protect using jQuery.isFunction() ?

					if (oControl.getMetadata()._sClassName === "sap.m.Input") {
						oControl.setValue(sScannedString);
					}

					if (oControl.getMetadata()._sClassName === "sap.m.ComboBox") {
						oControl.setSelectedKey(sScannedString);
					}

					oControl.fireChangeEvent(sScannedString);
				}

			} else {
				jQuery.sap.log.warning("Ihr Barcode konnte zwar gelesen, aber nicht zugeordnet werden.\nInhalt: \'" + sScannedString + "\'");
				// TODO: remove message box
				MessageBox.warning("Ihr Barcode konnte zwar gelesen, aber nicht zugeordnet werden.\nInhalt war: \'" + sScannedString + "\'");
			}

		},

		requestOrderHeaderInfoService: function(sOrderNumber) {
			if (!sOrderNumber) {
				return Promise.reject(new Error("Parameter 'sOrderNumber' is missing!"));
			}

			var oOrderHeaderModel = this.getModel("orderHeader"),
				oParam = {
					"Param.1": sOrderNumber
				};

			return oOrderHeaderModel.loadMiiData(oOrderHeaderModel._sServiceUrl, oParam);
		},

		requestOrderComponentInfoService: function(sOrderNumber, sMaterialNumber) {
			if (!sOrderNumber || !sMaterialNumber) {
				return Promise.reject(new Error("Parameter 'sOrderNumber' or 'sMaterialNumber' is missing!"));
			}

			var oOrderComponentModel = this.getModel("orderComponent"),
				oParam = {
					"Param.1": sOrderNumber,
					"Param.2": sMaterialNumber
				};

			return oOrderComponentModel.loadMiiData(oOrderComponentModel._sServiceUrl, oParam);
		},

		requestStorageUnitInfoService: function(sStorageUnitNumber) {

			if (!sStorageUnitNumber) {
				return Promise.reject(new Error("Parameter 'sStorageUnitNumber' is missing!"));
			}

			var oStorageUnitModel = this.getModel("storageUnit"),
				oParam = {
					"Param.1": sStorageUnitNumber
				};

			return oStorageUnitModel.loadMiiData(oStorageUnitModel._sServiceUrl, oParam);
		},

		showControlBusyIndicator: function(oSource) {
			return oSource.setBusyIndicatorDelay(0).setBusy(true);
		},

		hideControlBusyIndicator: function(oSource) {
			return oSource.setBusyIndicatorDelay(0).setBusy(false);
		},

		/**
		 * Check is a given storage location is allowed for posting
		 */
		isStorageLocationAllowed: function(sStorageLocation) {
			return this._aDisallowedStorageLocations.indexOf(sStorageLocation) === -1;
		},

		_formatStorageUnitData: function(oStorageUnit) {

			if (!oStorageUnit) {
				return null;
			}

			var fnNumberOrDefault = function(vAttr, vDefault) {
				return jQuery.isNumeric(vAttr) ? Number(vAttr) : vDefault;
			};

			oStorageUnit.LENUM = fnNumberOrDefault(oStorageUnit.LENUM, null);
			oStorageUnit.SOLLME = fnNumberOrDefault(oStorageUnit.SOLLME, 0.0);

			return oStorageUnit;
		},

		getScannerInputType: function(sScannedString) {

			return this.aScannerInputTypes.find(function(type) {

				return type.validationExpressions.find(function(regEx) {

					var regxCheck = new RegExp(regEx);
					if (regxCheck.test(sScannedString)) {
						return type;
					}

				});

			});
		},

		getControlByScannerInputType: function(oInputType) {
			return this._getIdByInputType(oInputType);
		},

		_getIdByInputType: function(oInputType) {
			jQuery.sap.log.warning("Scanner-Input wurde als " + oInputType.name + " erkannt, der action Dialog stellt aber keine passende Methode '_getIdByInputType(oInputType)' zur Verfügung.");

			return this.byId(oInputType.defaultControlId);

		},

		onSave: function() {
			jQuery.sap.log.error("This onSave function is a placeholder. Please make sure to implement this function in your action page controller!");
			MessageToast.show(this.getResourceText("messageSuccessBaseActionController"));
			this.onNavBack();
		},

		onClearFormPress: function(oEvent, bKeepMessageStrip) {
			var oNewInitialData = jQuery.extend({}, this._oInitData),
				oDataModel = this.getModel("data"),
				oNewInitialView = jQuery.extend({}, this._oInitView),
				oViewModel = this.getModel("view");

			oDataModel.setProperty("/", oNewInitialData);
			// force update to also override invalid values
			oDataModel.updateBindings(true);

			oViewModel.setProperty("/", oNewInitialView);
			// force update to also override invalid values
			oViewModel.updateBindings(true);

			if (!bKeepMessageStrip) {
				this.clearLogMessages();
			}
		},

		onClearQuantityInputPress: function(oEvent) {
			var oQuantityInputControl = this.byId("quantityInput");

			if (oQuantityInputControl) {
				// Delete value and set focus
				oQuantityInputControl
					.setValue("")
					.focus();

				// fire change event to trigger validation
				oQuantityInputControl.fireChange({
					value: ""
				});

			} else {
				MessageBox.error("Der feldinhalt konnte nicht gelöscht werden: Kein Control mit ID quantityInput gefunden!");
			}

		},

		_isDataModelInitial: function(oCurrentData, oInitialData) {
			return jQuery.sap.equal(oCurrentData, oInitialData, 2, true); //(a, b, maxDepth?, contains?) : boolean
		},

		/**
		 * checks if data model of the action page is inital (no changes by user)
		 * shows confirm dialog if data has been entered
		 * navigates bask without dialog if no data has changed
		 */
		onCancelAction: function(oEvent) {
			var oCurrentData = this.getModel("data").getData(),
				oInitialData = this._oInitData;

			if (!this._isDataModelInitial(oCurrentData, oInitialData)) {
				this.handleConfirmationMessageBoxPress(oEvent);
			} else {
				this.onNavBack();
			}

		},

		addLogMessage: function(oMessage) {
			var oMessageStripContainer = this.byId("messageStripContainer"),
				oMsgStrip;

			this.clearLogMessages();

			oMsgStrip = new MessageStrip(this.createId("messageStrip"), {
				text: oMessage.text || "Allgemeiner Fehler",
				showCloseButton: true,
				showIcon: true,
				type: oMessage.type || sap.ui.core.MessageType.Error
			});

			oMessageStripContainer.addContent(oMsgStrip);
		},

		clearLogMessages: function() {
			var oMsgStrip = this.byId("messageStrip"),
				oMessageStripContainer = this.byId("messageStripContainer");

			if (oMsgStrip) {
				oMsgStrip.destroy();
			}

			oMessageStripContainer.destroyContent();
		},

		isMessageModelClean: function() {
			var oMessageModel = sap.ui.getCore()
				.getMessageManager()
				.getMessageModel(),
				aMessages = oMessageModel.getData();

			if (aMessages && aMessages.length > 0) {
				return false;
			}
			return true;
		},

		handleConfirmationMessageBoxPress: function(oEvent) {
			var sMessage = this.getResourceText("messageConfirmCancelBaseActionController"),
				sTitle = this.getResourceText("titleConfirmCancelBaseActionController");

			MessageBox.confirm(sMessage, {
				title: sTitle,
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				defaultAction: MessageBox.Action.NO,
				styleClass: this._bCompact ? "sapUiSizeCompact" : "",
				onClose: this.fnConfirmCancelAction.bind(this)
			});

		},

		fnConfirmCancelAction: function(oAction) {
			if (oAction === sap.m.MessageBox.Action.YES) {
				this.onClearFormPress();
				this.onNavBack();
			}
		},

		cleanScannedOrderNumberString: function(sOrderNumberString) {
			return this.deleteLeadingZeros(sOrderNumberString).split("/")[0];
		},

		padStorageUnitNumber: function(sStorageUnitNumber) {
			return jQuery.sap.padLeft(sStorageUnitNumber.toString(), "0", 20);
		},

		deleteLeadingZeros: function(vNumber) {
			if (jQuery.type(vNumber) === "string") {
				return vNumber.replace(/^0+/, "");
			}
			return vNumber;
		}
	});

});