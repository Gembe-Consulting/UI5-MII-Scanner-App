sap.ui.define([
	"jquery.sap.global",
	"com/mii/scanner/controller/PageBaseController",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/m/MessageStrip",
	"sap/m/MessagePopover",
	"sap/m/MessageItem",
	"sap/ui/core/message/Message",
	"com/mii/scanner/model/formatter"
], function(jQuery, PageBaseController, MessageBox, MessageToast, MessageStrip, MessagePopover, MessageItem, Message, formatter) {
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

			this._oMessageManager = sap.ui.getCore().getMessageManager();
			this._oMessageModel = this._oMessageManager.getMessageModel();

			this.setModel(this._oMessageModel, "message");

			this.getView().attachValidationError(function(oEvent) {
				this.updateViewControls(this.getModel("data").getData()); //this.getModel("view").setProperty("/bValid", false)
			}.bind(this));
			// this.getView().attachParseError(function(oEvent) {
			// 	this.updateViewControls(this.getModel("data").getData()); //this.getModel("view").setProperty("/bValid", false)
			// }.bind(this));
			// this.getView().attachFormatError(function(oEvent) {
			// 	this.updateViewControls(this.getModel("data").getData()); //this.getModel("view").setProperty("/bValid", false)
			// }.bind(this));

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

		requestOrderOperationInfoService: function(sOrderNumber, sOperationNumber) {

			if (!sOrderNumber || !sOperationNumber) {
				return Promise.reject(new Error("Parameter 'sOrderNumber' or 'sOperationNumber' is missing!"));
			}

			var oOrderOperationModel = this.getModel("orderOperation"),
				oParam = {
					"Param.1": sOrderNumber,
					"Param.2": sOperationNumber
				};

			return oOrderOperationModel.loadMiiData(oOrderOperationModel._sServiceUrl, oParam);
		},

		requestOrderOperationIncidentsService: function(sOrderNumber, sOperationNumber) {
			var oOrderOperationIncidentsModel = this.getModel("orderIncidents"),
				oServiceData,
				oParam;

			if (typeof sOrderNumber === "string") {
				oServiceData = {
					orderNumber: sOrderNumber,
					operationNumber: sOperationNumber
				};
			} else {

				if (!sOrderNumber || sOrderNumber.d.results[0].Rowset.results[0].Row.results.length !== 1) {
					return Promise.reject(new Error("Rowset does not contain an operation!"));
				}

				oServiceData = {
					orderNumber: sOrderNumber.d.results[0].Rowset.results[0].Row.results[0].AUFNR,
					operationNumber: sOrderNumber.d.results[0].Rowset.results[0].Row.results[0].VORNR
				};
			}

			if (!oServiceData.orderNumber || !oServiceData.operationNumber) {
				return Promise.reject(new Error("Parameter 'order number' and/or 'operation number' is missing!"));
			}

			oParam = {
				"Param.1": oServiceData.orderNumber,
				"Param.2": oServiceData.operationNumber
			};

			return oOrderOperationIncidentsModel.loadMiiData(oOrderOperationIncidentsModel._sServiceUrl, oParam);

		},

		//http://su-mii-dev01.intern.suwelack.de:50000/XMII/Runner?Transaction=SUMISA/ProcessOrder/trx_SendBeginEndPhaseToSAP_TE&
		//AUFNR=1093363&VORGANG=0010&STATUS=0003&STATUS_TXT=Gestartet&TRX_ID=B10&RUECKZEIT=07.04.2018 16:39:52&MATNR=1701705-030&STOER=&Debug=1&UNAME=PHIGEM&IllumLoginName=PHIGEM&OutputParameter=OutputXML&Content-Type=text/xml
		requestTimeTicketService: function(sOrderNumber, sOperationNumber, oStatus, oDate, sMaterialNumber, sIncident, sComment) {
			var oTimeTicketModel = this.getModel("timeTicket"),
				sUsername = this.getModel("user").getProperty("/USERLOGIN"),
				oServiceData,
				oParam;

			if (typeof sOrderNumber === "string") {
				oServiceData = {
					orderNumber: sOrderNumber,
					operationNumber: sOperationNumber,
					newStatus: oStatus,
					date: oDate,
					materialNumber: sMaterialNumber,
					incident: sIncident,
					comment: $.base64.btoa(sComment || "", true)
				};
			} else {
				oServiceData = sOrderNumber;
			}

			if (!oServiceData.orderNumber || !oServiceData.operationNumber || !oServiceData.newStatus || !oServiceData.date) {
				return Promise.reject(new Error("One or more mandatory parameters missing!"));
			}

			oServiceData.dateFormatted = moment(oServiceData.date).format("DD.MM.YYYY HH:mm:ss"); //Format: 07.04.2018 16:39:52 //see https://momentjs.com/docs/#/displaying/

			oParam = {
				"Param.1": oServiceData.orderNumber,
				"Param.2": oServiceData.operationNumber,
				"Param.3": "1000",
				"Param.4": oServiceData.newStatus.STATUS_ID,
				"Param.5": oServiceData.newStatus.STATUS_TXT,
				"Param.6": oServiceData.dateFormatted,
				"Param.7": oServiceData.incident || "",
				"Param.8": oServiceData.materialNumber || "",
				"Param.9": oServiceData.newStatus.ACTION_KEY,
				"Param.10": sUsername,
				"Param.11": $.base64.btoa(oServiceData.comment || "", true)
			};

			return oTimeTicketModel.loadMiiData(oTimeTicketModel._sServiceUrl, oParam);
		},

		showControlBusyIndicator: function(oSource) {
			return oSource.setBusyIndicatorDelay(0).setBusy(true);
		},

		hideControlBusyIndicator: function(oSource) {
			return oSource.setBusyIndicatorDelay(0).setBusy(false);
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
				this.removeAllUserMessages();
				this.removeAllMessageManagerMessages();
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
				this.onClearFormPress();
				this.onNavBack();
			}

		},

		addUserMessage: function(oMessage, bKeepExisting) {
			var oMsgContainer = this.byId("messageStripContainer"),
				oMsgStrip = new MessageStrip({
					text: oMessage.text || "Ein unbekannter Fehler ist aufgetreten",
					showCloseButton: oMessage.showCloseButton === undefined ? true : false, //default true
					showIcon: oMessage.showIcon === undefined ? true : false, //default true
					customIcon: oMessage.customIcon,
					type: oMessage.type || sap.ui.core.MessageType.Error,
					enableFormattedText: oMessage.enableFormattedText || true //default false
				});

			if (!bKeepExisting) {
				this.removeAllUserMessages();
			}

			oMsgContainer.addContent(oMsgStrip);
		},

		removeAllUserMessages: function() {
			var oMsgContainer = this.byId("messageStripContainer");
			oMsgContainer.destroyContent();
		},

		/***************************************************************************
				addLogMessage: function(oMessage) {
					var oMessageStripContainer = this.byId("messageStripContainer"),
						oMsgStrip;

					this.clearLogMessages();

					oMsgStrip = new MessageStrip(this.createId("messageStrip"), {
						text: oMessage.text || "Ein unbekannter Fehler ist aufgetreten",
						showCloseButton: oMessage.showCloseButton || true,
						showIcon: oMessage.showIcon || true,
						customIcon: oMessage.customIcon,
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
		******************************************************************************/

		isMessageModelClean: function() {
			var oMessageModel = sap.ui.getCore()
				.getMessageManager()
				.getMessageModel(),
				aMessages = oMessageModel.getData();

			if (aMessages && aMessages.length > 0) {
				return false;
			}
			return true;
			//oder einfach:
			//return !!sap.ui.getCore().getMessageManager().getMessageModel().getData().length;
		},

		controlHasValidationError: function(oControl, sBindingProperty) {
			var aMessages = sap.ui.getCore().getMessageManager().getMessageModel().getData() || [];
			sBindingProperty = sBindingProperty || "value";

			return aMessages.some(function(message) {
				return message.target === oControl.getId() + "/" + sBindingProperty;
			});
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
		},

		onShowMessagePopoverPress: function(oEvent) {
			var oButton, oMessageTemplate, oMessagePopover;

			oButton = oEvent.getSource();

			/**
			 * Gather information that will be visible on the MessagePopover
			 */
			oMessageTemplate = new MessageItem({
				type: "{message>type}",
				title: "{message>message}",
				subtitle: "{message>additionalText}",
				description: "{message>additionalText}"
			});

			if (!this.byId("messagePopover")) {
				oMessagePopover = new MessagePopover(this.createId("messagePopover"), {
					items: {
						path: "message>/",
						template: oMessageTemplate
					},
					afterClose: function() {
						oMessagePopover.destroy();
					}
				});
				this._addDependent(oMessagePopover);
			}

			oMessagePopover.openBy(oButton);
		},

		_addDependent: function(oMessagePopover) {
			this.getView().addDependent(oMessagePopover);
		},
		/**
		 * Removes validation error messages from the previous step
		 */
		removeAllMessageManagerMessages: function() {
			this._oMessageManager.removeAllMessages();
		},
		/**
		 * Adds a message to the message manager
		 */
		addMessageManagerMessage: function(oMessage) {
			var oNewMessage = new Message({
				message: oMessage.message || oMessage,
				description: oMessage.description,
				type: oMessage.type || sap.ui.core.MessageType.Information
			});

			this._oMessageManager.addMessages(oNewMessage);
		}
	});

});