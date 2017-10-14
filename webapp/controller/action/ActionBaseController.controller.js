sap.ui.define([
	"com/mii/scanner/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function(BaseController, JSONModel, MessageBox, MessageToast) {
	"use strict";

	return BaseController.extend("com.mii.scanner.controller.action.ActionBaseController", {
		onInit: function() {
			this._bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
		},
		
		onSave:function(){
			MessageToast.show("Daten gespeichert!");
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
				}
			);
			
		},
		
		fnConfirmCancelAction: function(oAction) {
			if (oAction === sap.m.MessageBox.Action.YES) {
				this.onNavBack();
			}
		}
	});

});