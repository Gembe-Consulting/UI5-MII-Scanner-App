sap.ui.define([
	"jquery.sap.global",
	"com/mii/scanner/libs/momentjs/moment",
	"./BaseTTController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"com/mii/scanner/model/sapType",
	"com/mii/scanner/model/formatter"
], function(jQuery, momentjs, BaseTTController, JSONModel, MessageBox, sapType, formatter) {
	"use strict";
	/* global moment:true */
	
	return BaseTTController.extend("com.mii.scanner.controller.action.tt.ResumeOperation", {

		sapType: sapType,
		formatter: formatter,

		_oInitData: {
			//user input data
			orderNumber: null,
			operationNumber: null,
			dateTimeValue: null,
			//external data
			AUFNR: null
		},

		onInit: function() {
			//call super class onInit to apply user login protection. DO NOT DELETE!
			BaseTTController.prototype.onInit.call(this);

			this.setModel(new JSONModel(jQuery.extend({}, this._oInitData)), "data");

			this.setModel(new JSONModel(jQuery.extend({}, this._oInitView)), "view");

			this.getRouter()
				.getRoute("resumeOperation")
				.attachMatched(this._onRouteMatched, this);

		},

		//http://su-mii-dev01.intern.suwelack.de:50000/XMII/Illuminator?QueryTemplate=SUMISA/ProcessOrder/xac_SendBeginEndPhaseToSAP_TE&Param.2=1093379&Param.3=0010&Param.4=0003&Param.5=Gestartet&Param.9=B10&Param.6=01.05.2018 02:00:00&Param.7=P100&Param.8=PHIGEM&Param.32=1&1525272716126&Content-Type=text/xml
		onSave: function() {
			var oDataModel = this.getModel("data"),
				oServiceData,
				fnResolve,
				fnReject;

			this.getOwnerComponent().showBusyIndicator();

			fnResolve = function(oData) {
				var oConfiramationNumber,
					aRows,
					iExactlyOne = 1;

				if (!oData.success) {
					this.addUserMessage({
						text: oData.lastErrorMessage
					});
					
					return;
				}

				aRows = oData.d.results[0].Rowset.results[0].Row.results;

				/* Check if oData contains required results: extract value, evaluate value, set UI, set model data */
				if (aRows.length === iExactlyOne) {
					oConfiramationNumber = aRows[0];
				} else {
					throw new Error(this.getTranslation("resumeOperation.messageText.resultIncomplete") + " @OpResume");
				}

				this.addUserMessage({
					text: this.getTranslation("resumeOperation.messageText.postingSuccessfull", [oServiceData.orderNumber, oServiceData.operationNumber, moment(oServiceData.date).format("LLLL")]),
					type: sap.ui.core.MessageType.Success
				});

				this.addMessageManagerMessage("Rückmeldung " + oConfiramationNumber.CONF_NO + " erfolgreich gebucht.");

			}.bind(this);

			fnReject = function(oError) {
				this.addUserMessage({
					text: oError.message
				});
			}.bind(this);

			oServiceData = {
				orderNumber: oDataModel.getProperty("/orderNumber"),
				operationNumber: oDataModel.getProperty("/operationNumber"),
				newStatus: this.oProcessOrderStatus.started,
				date: oDataModel.getProperty("/dateTimeValue"),
				materialNumber: oDataModel.getProperty("/MATNR"),
				incident: oDataModel.getProperty("/latestInterruption/STRCODE"),
				comment: this.composeCommentResponse(this.byId("userCommentTextArea").getValue(), this._oldComment) || ""
			};

			//function(sOrderNumber, sOperationNumber, oStatus, oDate, sMaterialNumber, sIncident) || function(oServiceData)
			this.requestTimeTicketService(oServiceData)
				.then(fnResolve, fnReject)
				.then(this.getOwnerComponent().hideBusyIndicator)
				.then(function() {
					this.onClearFormPress({}, true /*bKeepMessageStrip*/ );
				}.bind(this));
		},

		composeCommentResponse: function(sResponse, sOldComment) {
			var sResult;

			if (!sOldComment) {
				return sResponse;
			}

			if (sResponse) {
				sResult = this.appendSignAndDateToComment(sResponse);
			} else {
				sResult = "";
			}

			if (sOldComment) {
				sResult = sResult + "\n=====\n" + sOldComment;
			}

			return sResult;
		},

		isInputDataValid: function(oData) {
			return !!oData.dateTimeValue && !!oData.orderNumber && !!oData.operationNumber;
		},

		checkInputIsValid: function(oData) {
			var oResumeMoment, // entry date by user
				oLatestInterruptionMoment,
				oOrderNumberInput = this.byId("orderNumberInput"),
				oOperationNumberInput = this.byId("operationNumberInput"),
				oDateTimeInput = this.byId("dateTimeEntry");

			// 0. check if necessary data is present
			if (!oData.AUFNR || !oData.dateTimeValue) {
				return false;
			}

			oResumeMoment = moment(oData.dateTimeValue);

			// 1. ensure operation status is valid
			if (oData.STATUS !== this.oProcessOrderStatus.interrupted.STATUS_ID) { // check if operation has status "Störung"
				this.addUserMessage({
					text: this.getTranslation("resumeOperation.messageText.wrongCurrentStatus", [oData.AUFNR, oData.VORNR, oData.STATUS_TXT])
				});
				oOrderNumberInput.setValueState(sap.ui.core.ValueState.Error);
				oOperationNumberInput.setValueState(sap.ui.core.ValueState.Error);
				return false;
			}

			// 2. ensure entered resume date is after start date 
			// -> not needed - coverd by operation status

			// 3. check if we have an open interruption
			// -> not needed - coverd by operation status
			/*
				if (oData.latestInterruption.STR_ENDE !== "TimeUnavailable") {
					this.addUserMessage({
						text: this.getTranslation("resumeOperation.messageText.noOpenInterruptionFound", [oData.AUFNR, oData.VORNR])
					});
					oOrderNumberInput.setValueState(sap.ui.core.ValueState.Error);
					oOperationNumberInput.setValueState(sap.ui.core.ValueState.Error);
					return false;
				}
			*/
			oLatestInterruptionMoment = moment(this.formatter.parseJSONDate(oData.latestInterruption.STR_BEGINN));

			// 3. ensure entered resume date is after latest interruption start date
			if (oResumeMoment.isBefore(oLatestInterruptionMoment)) {
				this.removeAllUserMessages();
				this.addUserMessage({
					text: this.getTranslation("resumeOperation.messageText.finishDateBeforeLastInterruptionDate", [oData.AUFNR, oData.VORNR, oData.latestInterruption.STRCODE, oData.latestInterruption.STR_TXT, oLatestInterruptionMoment.format("LLLL"), oResumeMoment.format("LLLL")])
				});
				oDateTimeInput.setValueState(sap.ui.core.ValueState.Error);
				return false;
			}

			// everything is ok

			this.addUserMessage({
				text: this.getTranslation("resumeOperation.messageText.currentInterruption", [oData.AUFNR, oData.VORNR, oData.latestInterruption.STRCODE, oData.latestInterruption.STR_TXT, oLatestInterruptionMoment.format("LLLL"), oData.latestInterruption.ERFASSER]),
				type: sap.ui.core.MessageType.Information,
				showCloseButton: false
			});

			oOrderNumberInput.setValueState(sap.ui.core.ValueState.Success);
			oOperationNumberInput.setValueState(sap.ui.core.ValueState.Success);
			oDateTimeInput.setValueState(sap.ui.core.ValueState.Success);

			return true;
		},

		onEditUserCommentPress: function(oEvent) {
			var oTextArea = this.byId("userCommentTextArea"),
				oSource = oEvent.getSource();

			if (oTextArea.getEditable()) {
				oTextArea.setEditable(false);
				oTextArea.setValue(this._oldComment);
				oSource.setIcon("sap-icon://response").setTooltip("Antworten");
			} else {
				oTextArea.setEditable(true);
				this._oldComment = oTextArea.getValue();
				oTextArea.setValue();
				oSource.setIcon("sap-icon://reset").setTooltip("Antwort zurücksetzen");
			}
		}
	});
});