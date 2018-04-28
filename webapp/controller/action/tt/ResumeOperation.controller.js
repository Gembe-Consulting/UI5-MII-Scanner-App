sap.ui.define([
	"./BaseTTController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"com/mii/scanner/model/sapType",
	"com/mii/scanner/model/formatter"
], function(BaseTTController, JSONModel, MessageBox, sapType, formatter) {
	"use strict";

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

		_oInitView: {
			bValid: false,
			bOrderOperationExists: false,
			bDateTimeEntryValid: true,
			orderInputValueState: sap.ui.core.ValueState.None,
			dateTimeInputValueState: sap.ui.core.ValueState.None
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
				this.updateViewControls(oDataModel.getData());
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
				var oOperation,
					aRows = oData.d.results[0].Rowset.results[0].Row.results;

				/* Check if oData contains required results: extract value, evaluate value, set UI, set model data */
				if (aRows.length === 1) {
					oOperation = aRows[0];
				} else {
					return Promise.reject(new Error(this.getTranslation("resumeOperation.messageText.orderNotFound", [sOrderNumber, sOperationNumber])));
				}

				if (oOperation.STATUS !== this.oProcessOrderStatus.interrupted.STATUS_ID) { // check if operation has status "interrupted"
					return Promise.reject(new Error(this.getTranslation("resumeOperation.messageText.wrongCurrentStatus", [oOperation.AUFNR, oOperation.VORNR, oOperation.STATUS_TXT])));
				}

				oDataModel.setData(oOperation, true);

				return oData;

			};

			fnResolveIncidentService = function(oData) {
				var aRows = oData.d.results[0].Rowset.results[0].Row.results,
					oNullBeginn = {
						STR_BEGINN: null
					},
					oLatestInterruption,
					fnLatestIncident;

				/* Check if oData contains required results: extract value, evaluate value, set UI, set model data */
				if (aRows.length === 0) {
					return Promise.reject(new Error(this.getTranslation("resumeOperation.messageText.noInterruptionFound", [sOrderNumber, sOperationNumber])));
				}

				fnLatestIncident = function(oPrevIncident, oIncident, currentIndex, array) {
					var oNewDate = this.formatter.parseJSONDate(oIncident.STR_BEGINN),
						oOldDate = this.formatter.parseJSONDate(oPrevIncident.STR_BEGINN);

					if (oOldDate > oNewDate) {
						return oPrevIncident;
					}

					return oIncident;

				}.bind(this);

				oLatestInterruption = aRows.reduce(fnLatestIncident, oNullBeginn /*initial value*/ );

				if (oLatestInterruption.STR_ENDE !== "TimeUnavailable") {
					return Promise.reject(new Error(this.getTranslation("resumeOperation.messageText.noOpenInterruptionFound", [sOrderNumber, sOperationNumber])));
				}

				// set LATEST EVENT property
				oDataModel.setProperty("/latestInterruption", oLatestInterruption);

				// update UI
				this.getModel("view").setProperty("/bOrderOperationValid", true);
				oOrderNumberInput.setValueState(sap.ui.core.ValueState.Success);
				oOperationNumberInput.setValueState(sap.ui.core.ValueState.Success);

				return oData;
			};

			/* Prepare error callback */
			fnReject = function(oError) {
				var oOrderOperation = {
					AUFNR: null
				};

				oDataModel.setData(oOrderOperation, true);

				this.addUserMessage({
					text: oError.responseText || oError.message
				});

				this.getModel("view").setProperty("/bOrderOperationValid", false);
				oOrderNumberInput.setValueState(sap.ui.core.ValueState.Error);
				oOperationNumberInput.setValueState(sap.ui.core.ValueState.Error);
			};

			fnCleanUp = function(oDate) {
				this.hideControlBusyIndicator(oOrderNumberInput);
				this.hideControlBusyIndicator(oOperationNumberInput);
				this.updateViewControls(oDataModel.getData());
			};

			/* Perform service call, Hide Busy Indicator, Update View Controls */
			this.requestOrderOperationInfoService(sOrderNumber, sOperationNumber)
				.then(fnResolve.bind(this))
				.then(this.requestOrderOperationIncidentsService.bind(this))
				.then(fnResolveIncidentService.bind(this))
				.catch(fnReject.bind(this))
				.then(fnCleanUp.bind(this));
		},

		isInputDataValid: function(oData) {
			return !!oData.dateTimeValue && !!oData.orderNumber && !!oData.operationNumber && !!oData.AUFNR;
		},

		checkInputIsValid: function(oData) {
			var oFinishMoment, // entry date by user
				oLatestInterruptionStartMoment,
				oOrderNumberInput = this.byId("orderNumberInput"),
				oOperationNumberInput = this.byId("operationNumberInput"),
				oDateTimeInput = this.byId("dateTimeEntry");

			// 1. check if necessary data is present
			if (!oData.AUFNR || !oData.dateTimeValue || !oData.latestInterruption) {
				return false;
			}

			oFinishMoment = moment(oData.dateTimeValue);
			oLatestInterruptionStartMoment = moment(this.formatter.parseJSONDate(oData.latestInterruption.STR_BEGINN));

			// 2. ensure entered finish date is after start date 
			// not needed -> we already made sure to only habe operations with status "Störung" 

			// 3. ensure entered finish date is after latest interruption start date
			if (oFinishMoment.isBefore(oLatestInterruptionStartMoment)) {
				this.removeAllUserMessages();
				this.addUserMessage({
					text: this.getTranslation("resumeOperation.messageText.finishDateBeforeLastInterruptionDate", [oData.AUFNR, oData.VORNR, oData.latestInterruption.STRCODE, oData.latestInterruption.STR_TXT, oLatestInterruptionStartMoment.format("LLLL"), oFinishMoment.format("LLLL")])
				});
				oDateTimeInput.setValueState(sap.ui.core.ValueState.Error);
				return false;
			}

			// everything is ok

			this.addUserMessage({
				text: this.getTranslation("resumeOperation.messageText.currentInterruption", [oData.AUFNR, oData.VORNR, oData.latestInterruption.STRCODE, oData.latestInterruption.STR_TXT, oLatestInterruptionStartMoment.format("LLLL"), oData.latestInterruption.ERFASSER]),
				type: sap.ui.core.MessageType.Information
			});
			oOrderNumberInput.setValueState(sap.ui.core.ValueState.Success);
			oOperationNumberInput.setValueState(sap.ui.core.ValueState.Success);
			oDateTimeInput.setValueState(sap.ui.core.ValueState.Success);

			return true;
		}
	});
});