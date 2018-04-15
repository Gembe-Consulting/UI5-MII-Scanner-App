sap.ui.define([
	"./ActionBaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"com/mii/scanner/model/sapType",
	"com/mii/scanner/model/formatter"
], function(ActionBaseController, JSONModel, MessageBox, sapType, formatter) {
	"use strict";

	return ActionBaseController.extend("com.mii.scanner.controller.action.FinishOperation", {

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

		_oInitView: {
			bValid: false,
			bOrderOperationValid: false,
			bDateTimeEntryValid: true,
			orderInputValueState: sap.ui.core.ValueState.None,
			dateTimeInputValueState: sap.ui.core.ValueState.None
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
				bInputValuesComplete,
				bInputValuesValid,
				bNoErrorMessagesActive,
				bReadyForPosting;

			// check if all required input data is present
			bInputValuesComplete = this.isInputDataValid(oData);

			bInputValuesValid = this.checkInputIsValid(oData);

			// check if all input data has proper format
			bNoErrorMessagesActive = this.isMessageModelClean();

			// we are ready for posting once we have complete and proper formatted input
			bReadyForPosting = bOrderOperationValid && bInputValuesComplete && bInputValuesValid && bNoErrorMessagesActive;

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
				fnResolveIncidentService,
				fnCleanUp;

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
					aRows = oData.d.results[0].Rowset.results[0].Row.results,
					bOrderOperationValid = true;

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
					return Promise.reject("Order or Operation not found!");
				}

				return oData;

			}.bind(this);

			fnResolveIncidentService = function(oData) {
				var aRows = oData.d.results[0].Rowset.results[0].Row.results,
					oLatestIncidentFinishDate,
					oNullDate = null,
					fnLatestEndDate;

				fnLatestEndDate = function(oldDate, oIncident, currentIndex, array) {
					var oNewDate = this.formatter.parseJSONDate(oIncident.STR_ENDE);
					return oldDate > oNewDate ? oldDate : oNewDate;
				}.bind(this);

				oLatestIncidentFinishDate = aRows.reduce(fnLatestEndDate, oNullDate /*initial value*/ );

				// set LATEST_EVENT_FINISH property
				this.getModel("data").setProperty("/LATEST_EVENT_FINISH", oLatestIncidentFinishDate);

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

			fnCleanUp = function(oDate) {
				this.hideControlBusyIndicator(oOrderNumberInput);
				this.hideControlBusyIndicator(oOperationNumberInput);
				this.updateViewControls(this.getModel("data").getData());
			}.bind(this);

			/* Perform service call, Hide Busy Indicator, Update View Controls */
			this.requestOrderOperationInfoService(sOrderNumber, sOperationNumber)
				.then(fnResolve, fnReject)
				.then(this.requestOrderOperationIncidentsService.bind(this))
				.then(fnResolveIncidentService, jQuery.noop)
				.then(fnCleanUp);
		},

		checkInputIsValid: function(oData) {
			var oStartMoment, oFinishMoment, oLastResumeMoment,
				//oData = this.getModel("data").getData(),
				oDateTimeInput = this.byId("dateTimeEntry");

			// 1. check if necessary data is present
			if (!oData.AUFNR || !oData.dateTimeValue) {
				return false;
			}

			oStartMoment = moment(this.formatter.parseJSONDate(oData.ISTSTART));
			oLastResumeMoment = moment(oData.LATEST_EVENT_FINISH);
			oFinishMoment = moment(oData.dateTimeValue);

			// 2. ensure enterd finish date is after start date
			if (oFinishMoment.isBefore(oStartMoment)) {
				this.removeAllUserMessages();
				this.addUserMessage({
					text: this.getTranslation("finishOperation.messageText.finishDateBeforeStartDate", [oData.AUFNR, oData.VORNR, oStartMoment.format("LLLL"), oFinishMoment.format("LLLL")])
				});
				oDateTimeInput.setValueState(sap.ui.core.ValueState.Error);
				return false;
			}

			// 3. ensure entered finish date is after latest interruption finish date
			if (oFinishMoment.isBefore(oLastResumeMoment)) {
				this.removeAllUserMessages();
				this.addUserMessage({
					text: this.getTranslation("finishOperation.messageText.finishDateBeforeLastResumeDate", [oData.AUFNR, oData.VORNR, oLastResumeMoment.format("LLLL"), oFinishMoment.format("LLLL")])
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
			var oData = this.getModel("data").getData();
			this.removeAllUserMessages();
			this.updateViewControls(oData);
		},

		onProcessOrderChartPress: function(oEvent) {
			MessageBox.show("Statuswechsel zu Auftrag 4711: \nStart: 13.07.18, 19:00 \nStörung: 14.07.18, 03:00 bis 14.07.18, 07:00 \nStörung: 14.07.18, 10:30 bis 14.07.18, 10:45");
		},

		_refreshDateValue: function() {
			var oDate = new Date();
			this.getModel("data").setProperty("/dateTimeValue", oDate);
			this._oInitData.dateTimeValue = oDate;
		}

	});

});