sap.ui.define([
	"com/mii/scanner/controller/PageBaseController",
	"sap/m/MessageBox",
	"sap/m/MessageItem",
	"sap/m/MessagePopover",
	"sap/m/MessageToast",
	"sap/ui/core/message/ControlMessageProcessor",
	"openui5/validator/Validator"
], function(PageBaseController, MessageBox, MessageItem, MessagePopover, MessageToast, ControlMessageProcessor, Validator) {
	"use strict";

	return PageBaseController.extend("com.mii.scanner.controller.action.ActionBaseController", {
		_initMessageManager: function() {
			//Initialize the message processor and message manager
			this._messageManager = sap.ui.getCore().getMessageManager();
			this._messageManager.registerMessageProcessor(new ControlMessageProcessor());

			//Initialize the Message Popover used to display the errors
			this._messagePopover = new MessagePopover({
				items: {
					path: 'message>',
					template: new MessageItem({
						description: '{message>description}',
						type: '{message>type}',
						title: '{message>message}',
						subtitle: 'ID adssa'
					})
				}
			});
		},

		_onValidationSuccess: function() {
			this._messagePopover.close();
			this.getView().byId('btMessagePopover').setVisible(false);
			MessageToast.show('Form is valid! No errors!');
		},

		_onValidationError: function(validationResult) {
			this._messageManager.addMessages(validationResult.ui5ErrorMessageObjects);
			this.getView().byId('btMessagePopover').setText(validationResult.ui5ErrorMessageObjects.length);
			this.getView().byId('btMessagePopover').setVisible(true);
			MessageBox.error('Form is invalid! It contains errors!', {
				details: validationResult.originalErrorMessages
			});
		},
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