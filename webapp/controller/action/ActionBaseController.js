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
		constructor: function(sId, mProperties) {

			this.mScannerInputTypes = {
				storageUnit: {
					key: "LENUM",
					name: "Storage Unit",
					validationExpression: /^(0{8}|.{0})10\d{10}/gm
				},
				storageLocation: {
					key: "LGORT",
					name: "Storage Location",
					validationExpression: /^[a-zA-z0-9]{4}$/gm
				},
				userName: {
					key: "USER",
					name: "Username",
					validationExpression: /^[a-zA-z0-9]{6,8}$/gm
				},
				orderNumberOperation: {
					key: "AUFNR_VORNR",
					name: "Order Number and Operation",
					validationExpression: /^1\d{6}\/\d{4}$/gm
				}
			};
		},

		onInit: function() {
			PageBaseController.prototype.onInit.call(this);
		},

		requestOrderHeaderInfoService: function(sOrderNumber) {
			if (!sOrderNumber) {
				return Promise.reject({
					message: "Input parameters not complete: Order number missing",
					statusCode: 0,
					statusText: "sOrderNumber=" + sOrderNumber,
					responseText: "Please provide all input parameters to perform the call!"
				});
			}

			var oOrderHeaderModel = this.getModel("orderHeader"),
				oParam = {
					"Param.1": sOrderNumber
				};

			return oOrderHeaderModel.loadMiiData(oOrderHeaderModel._sServiceUrl, oParam);
		},

		requestOrderComponentInfoService: function(sOrderNumber, sMaterialNumber) {
			if (!sOrderNumber || !sMaterialNumber) {
				return Promise.reject({
					message: "Input parameters not complete",
					statusCode: 0,
					statusText: "sOrderNumber=" + sOrderNumber + " - sMaterialNumber=" + sMaterialNumber,
					responseText: "Please provide all input parameters to perform the call!"
				});
			}

			var oOrderComponentModel = this.getModel("orderComponent"),
				oParam = {
					"Param.1": sOrderNumber,
					"Param.2": sMaterialNumber
				};

			return oOrderComponentModel.loadMiiData(oOrderComponentModel._sServiceUrl, oParam);
		},

		requestStorageUnitInfoService: function(sStorageUnitNumber) {
			var oStorageUnitModel = this.getModel("storageUnit"),
				oParam = {
					"Param.1": sStorageUnitNumber
				};

			return oStorageUnitModel.loadMiiData(oStorageUnitModel._sServiceUrl, oParam);
		},

		showControlBusyIndicator: function(oSource) {
			return oSource.setBusyIndicatorDelay(0)
				.setBusy(true);
		},

		hideControlBusyIndicator: function(oSource) {
			return oSource.setBusyIndicatorDelay(0)
				.setBusy(false);
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
			var oType;

			jQuery.each(this.mScannerInputTypes, function(sName, oValue) {
				var regxCheck = new RegExp(oValue.validationExpression);
				if (regxCheck.test(sScannedString)) {
					oType = oValue;
					return false;
				}
			});

			return oType;
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
				
			}else{
				MessageBox.error("Der feldinhalt konnte nicht gelöscht werden: Kein Control mit ID quantityInput gefunden!");
			}

		},

		onCancelAction: function(oEvent) {
			this.handleConfirmationMessageBoxPress(oEvent);
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
			} else {
				return true;
			}
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

		_padStorageUnitNumber: function(sStorageUnitNumber) {
			return jQuery.sap.padLeft(sStorageUnitNumber, "0", 20);
		}
	});

});