sap.ui.define([
	"./ActionBaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"com/mii/scanner/model/sapType"
], function(ActionBaseController, JSONModel, MessageBox, sapType) {
	"use strict";

	return ActionBaseController.extend("com.mii.scanner.controller.action.FinishOperation", {

		sapType: sapType,

		_oInitData: {
			//user input data
			orderNumber: null,
			operationNumber: null,
			dateTimeValue: null,
			//external data
			AUFNR: null
		},

		_oInitView: {
			bValid: false,
			bOrderOperationValid: false,
			bDateTimeEntryValid: true,
			orderInputValueState: sap.ui.core.ValueState.None
		},

		onInit: function() {
			//call super class onInit to apply user login protection. DO NOT DELETE!
			ActionBaseController.prototype.onInit.call(this);

			this.setModel(new JSONModel(jQuery.extend({}, this._oInitData)), "data");

			this.setModel(new JSONModel(jQuery.extend({}, this._oInitView)), "view");

			this.getView().addEventDelegate({
				onBeforeShow: this._refreshDateValue
			}, this);

		},

		//http://su-mii-dev01.intern.suwelack.de:50000/XMII/Runner?Transaction=SUMISA/ProcessOrder/trx_SendBeginEndPhaseToSAP_TE&AUFNR=1093363&VORGANG=0010&STATUS=0045&STATUS_TXT=Beendet&TRX_ID=B40&RUECKZEIT=07.04.2018 16:43:41&MATNR=1701705-030&STOER=&UNAME=PHIGEM&IllumLoginName=PHIGEM&OutputParameter=OutputXML&Content-Type=text/xml
		onSave: function() {

		},

		updateViewControls: function(oData) {
			var oViewModel = this.getModel("view"),
				bOrderOperationValid = oViewModel.getProperty("/bOrderOperationValid"),
				bInputValuesValid,
				bInputValuesComplete,
				bNoErrorMessagesActive,
				bReadyForPosting;

			// check if all required input data is present
			bInputValuesComplete = this.isInputDataValid(oData);

			bInputValuesValid = this.checkInputIsValid(oData);

			// check if all input data has proper format
			bNoErrorMessagesActive = this.isMessageModelClean();

			// we are ready for posting once we have complete and proper formatted input
			bReadyForPosting = bInputValuesComplete && bOrderOperationValid && bInputValuesValid && bNoErrorMessagesActive;

			oViewModel.setProperty("/bValid", bReadyForPosting);
		},

		isInputDataValid: function(oData) {
			return !!oData.dateTimeValue && !!oData.orderNumber && !!oData.operationNumber;
		},

		onOrderChange: function(oEvent) {
			var oSource = oEvent.getSource(),
				oOrderNumberInput = this.byId("orderNumberInput"),
				oOperationNumberInput = this.byId("operationNumberInput"),
				oDataModel = this.getModel("data"),
				sOrderNumber = oDataModel.getProperty("/orderNumber"),
				sOperationNumber = oDataModel.getProperty("/operationNumber"),
				fnResolve,
				fnReject,
				fnResolveIncidentList,
				fnRejectIncidentList;

			/* check if current input is valid */
			if (!sOrderNumber || !sOperationNumber) {
				return;
			}
			if (this.controlHasValidationError(oSource)) {
				return;
			}

			/* Prepare UI: busy, value states, log messages */
			this.showControlBusyIndicator(oOrderNumberInput);
			this.showControlBusyIndicator(oOperationNumberInput);

			this.removeAllUserMessages();

			/* Prepare Data */

			/* Prepare success callback */
			fnResolve = function(oData) {
				var oOrderOperation = {
						AUFNR: null
					},
					aRows,
					bOrderOperationValid = true;

				try {
					aRows = oData.d.results[0].Rowset.results[0].Row.results;
				} catch (oError) {
					aRows = [];
				}

				/* Check if oData contains required results: extract value, evaluate value, set UI, set model data */
				if (aRows.length === 1) {
					oOrderOperation = aRows[0];

					if (oOrderOperation.STATUS !== this.oProcessOrderStatus.started.STATUS_ID) { // check if operation has status "started"
						this.addUserMessage({
							text: this.getTranslation("finishOperation.messageText.wrongCurrentStatus", [sOrderNumber, sOperationNumber, oOrderOperation.STATUS_TXT])
						});

						bOrderOperationValid = false;
					}
				} else {
					this.addUserMessage({
						text: this.getTranslation("finishOperation.messageText.orderNotFound", [sOrderNumber, sOperationNumber])
					});

					bOrderOperationValid = false;
				}

				oDataModel.setData(oOrderOperation, true);

				this.getModel("view").setProperty("/bOrderOperationValid", bOrderOperationValid);

				if (bOrderOperationValid) {
					oOrderNumberInput.setValueState(sap.ui.core.ValueState.Success);
					oOperationNumberInput.setValueState(sap.ui.core.ValueState.Success);
				} else {
					oOrderNumberInput.setValueState(sap.ui.core.ValueState.Error);
					oOperationNumberInput.setValueState(sap.ui.core.ValueState.Error);
				}

				return oData;

			}.bind(this);

			/* Prepare error callback */
			fnReject = function(oError) {
				MessageBox.error(oError.responseText || oError.message, {
					title: this.getTranslation("error.miiTransactionErrorText", ["OrderOperationRead"]),
					contentWidth: "500px"
				});
				//oSource.setValueState(sap.ui.core.ValueState.Error).setValue("");
				this.getModel("view").setProperty("/bOrderOperationValid", false);
			}.bind(this);

			/* Perform service call, Hide Busy Indicator, Update View Controls */
			this.requestOrderOperationInfoService(sOrderNumber, sOperationNumber)
				.then(fnResolve, fnReject)
				.then(this.requestOrderOperationIncidentsService.bind(this))
				.then(fnResolveIncidentList, fnRejectIncidentList)
				.then(function() {
					this.hideControlBusyIndicator(oOrderNumberInput);
					this.hideControlBusyIndicator(oOperationNumberInput);
				}.bind(this))
				.then(function() {
					this.updateViewControls(this.getModel("data").getData());
				}.bind(this));
		},

		checkInputIsValid: function(oData) {
			var oStartMoment, oFinishMoment, oLatstResumeMoment,
				//oData = this.getModel("data").getData(),
				oDateTimeInput = this.byId("dateTimeEntry");

			// 1. check if order is present
			if (!oData.AUFNR) {
				return false;
			}

			oStartMoment = moment(oData.ISTSTART);
			oLatstResumeMoment = moment(oData.LATEST_EVENT_FINISH);
			oFinishMoment = moment(oData.dateTimeValue);

			// 2. ensure enterd finish date is after start date
			if (oFinishMoment.isBefore(oStartMoment)) {
				this.removeAllUserMessages();
				this.addUserMessage({
					text: this.getTranslation("finishOperation.messageText.finishDateBeforeStartDate", [oData.AUFNR, oData.VORNR, oFinishMoment.format("LLLL"), oStartMoment.format("LLLL")])
				});

				oDateTimeInput.setValueState(sap.ui.core.ValueState.Error);
				return false;
			}

			// 3. ensure entered finish date is after latest interruption finish date
			if (oFinishMoment.isBefore(oLatstResumeMoment)) {
				this.removeAllUserMessages();
				this.addUserMessage({
					text: this.getTranslation("finishOperation.messageText.finishDateBeforeLastResumeDate", [oData.AUFNR, oData.VORNR, oFinishMoment.format("LLLL"), oLatstResumeMoment.format("LLLL")])
				});

				oDateTimeInput.setValueState(sap.ui.core.ValueState.Error);
				return false;
			}

			oDateTimeInput.setValueState(sap.ui.core.ValueState.Success);
			return true;
		},

		onOrderNumberInputChange: function(oEvent) {
			this.onOrderChange(oEvent);
		},

		onOperationNumberInputChange: function(oEvent) {
			this.onOrderChange(oEvent);
		},

		onDateTimeEntryChange: function(oEvent) {
			this.updateViewControls(this.getModel("data").getData());
		},

		_refreshDateValue: function() {
			var oDate = new Date();
			this.getModel("data").setProperty("/dateTimeValue", oDate);
			this._oInitData.dateTimeValue = oDate;
		}

	});

});