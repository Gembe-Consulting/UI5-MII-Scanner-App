sap.ui.define([
	"com/mii/scanner/controller/PageBaseController",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function(PageBaseController, MessageBox, MessageToast) {
	"use strict";

	return PageBaseController.extend("com.mii.scanner.controller.action.ActionBaseController", {

		onSave: function() {
			MessageToast.show(this.getResourceText("messageSuccessBaseActionController"));
			this.onNavBack();
		},

		onCancelAction: function(oEvent) {
			this.handleConfirmationMessageBoxPress(oEvent);
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
				this.onNavBack();
			}
		}
	});

});