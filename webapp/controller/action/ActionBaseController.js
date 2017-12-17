sap.ui.define([
	"com/mii/scanner/controller/PageBaseController",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/m/MessageStrip"
], function(PageBaseController, MessageBox, MessageToast, MessageStrip) {
	"use strict";

	return PageBaseController.extend("com.mii.scanner.controller.action.ActionBaseController", {

		getScannerInputType: function(sScannedString) {

		},

		onSave: function() {
			jQuery.sap.log.error("This onSave function is a placeholder. Please make sure to implement this function in your action page controller!");
			MessageToast.show(this.getResourceText("messageSuccessBaseActionController"));
			this.onNavBack();
		},

		onClearFormPress: function() {
			jQuery.sap.log.error("This onClearFormPress function is a placeholder. Please make sure to implement this function in your action page controller!");
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
		}
	});

});